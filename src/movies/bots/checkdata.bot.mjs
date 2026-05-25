import mongoose, { Schema } from 'mongoose';
import axios from 'axios';
import { ConnectModel, Movies, Episodes } from './db.mjs';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const movies = Movies;
const epsiodes = Episodes;
const generateSlug = (episode) => {
  const cleanEpisode = episode
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `tap-${cleanEpisode}`;
};
const getIdFromUrl = (url) => {
  if (!url) return '';
  return url.split('/').pop() || '';
};
// fetch Animapper t get episode
const getEpisodeAnime = async (anime) => {
  try {
    console.log(anime.anilistId)
    const res = await axios.get(`https://api.animapper.net/api/v1/stream/episodes?id=${anime.anilistId}&provider=ANIMEVIETSUB`)
    const infoEpisode = await res.data;
    return infoEpisode.episodes
  }
  catch (error) {
    const status = error.response?.status;
    if (status >= 500) {
      console.error(`Server Animapper dropdown epsiode ${status}`);
      throw new Error("CRITICAL_PROVIDER_FAILURE");
    }
    return []
  }
}
// fetch Animapper t get link embed
const getLinkEpisode = async (id, listEpisode) => {
  const finalResults = [];
  let ErrorCount = 0
  const numberEpisodeSaved = await epsiodes.countDocuments({ anilistId: id })
  for (let i = numberEpisodeSaved; i < listEpisode.length; i++) {
    try {
      const res = await axios.get(
        `https://api.animapper.net/api/v1/stream/source?episodeData=${listEpisode[i].episodeId}&provider=ANIMEVIETSUB&server=HDX`
      );
      if (res.data && res.data.url) {
        finalResults.push({
          ...listEpisode[i],
          url: getIdFromUrl(res.data.url),
        });
      }
    } catch (error) {
      const status = error.response?.status;
      console.log(listEpisode[i])
      if (status >= 500) {
        console.warn(`Bỏ qua tập ${listEpisode[i].episodeId} do lỗi: ${status || 'Network'}`);
        continue;
      }
    }
    await sleep(1500)
  }
  return finalResults;
}
// save to episode collection
const saveEpisodeToDB = async (id, episodeResults) => {
  const operations = episodeResults.map((item) => {
    return {
      updateOne: {
        filter: {
          anilistId: id,
          episodeSlug: generateSlug(item.episodeNumber),
        },
        update: {
          $set: {
            episodeNumber: item.episodeNumber,
            server: item.server,
            episodeId: item.episodeId,
            url: item.url,
          },
        },
        upsert: true,
      }
    }
  })
  try {
    await epsiodes.bulkWrite(operations, { ordered: false });
  } catch (error) {
    console.log("Khong co tap moi bo qua")
  }
}
const saveErrorAnime = async (anime) => {
  const result = await movies.updateOne(
    { anilistId: anime.anilistId },
    {
      $inc: { checkAttempts: 1 },
      $set: { lastChecked: new Date() }
    },
    { upsert: true }
  )
  console.log(result);
}
const saveReleasingAnime = async (anime) => {
  await movies.updateOne(
    { anilistId: anime.anilistId },
    {
      $set: {
        lastChecked: new Date(),
        isPublished: true
      }
    },
    { upsert: true }
  )
}
const saveFinishedAnime = async (anime) => {
  await movies.updateOne(
    { anilistId: anime.anilistId },
    {
      $set: {
        lastChecked: new Date(),
        isPublished: true,
        isComplete: true
      }
    },
    { upsert: true }
  )
}
// bot Work
const botCheckAnime = async () => {
  try {
    const data = await movies.find({
      $or: [
        {
          $and: [
            { status: { $in: ["RELEASING", "FINISHED"] } },
            { isPublished: true },
            { isComplete: { $exists: false } }
          ]
        },
        {
          $and: [
            { status: { $in: ["RELEASING", "FINISHED"] } },
            { isPublished: false },
            {
              $or: [
                { checkAttempts: { $exists: false } },
                { checkAttempts: { $gte: 1, $lt: 10 } },
              ]
            }
          ]
        }
      ]
    })
      .sort({ trending: -1 })
      .select("anilistId titleRomaji episodes status nextAiringEpisode trending")
    for (const anime of data) {
      console.log(`Dang kiem tra anime ${anime.titleRomaji} `)
      const totalEpisode = anime.episodes ? anime.episodes : anime.nextAiringEpisode.episode - 1
      const listEpsiode = await getEpisodeAnime(anime)
      if (!listEpsiode) continue;
      if (listEpsiode.length === 0) {
        await saveErrorAnime(anime)
      }
      else if (listEpsiode.length < totalEpisode) {
        const episodeResults = await getLinkEpisode(anime.anilistId, listEpsiode);
        if (episodeResults.length === 0) continue;
        await saveEpisodeToDB(anime.anilistId, episodeResults)
        await saveReleasingAnime(anime)
      }
      else {
        const episodeResults = await getLinkEpisode(anime.anilistId, listEpsiode);
        if (episodeResults.length === 0) {
          continue
        };
        await saveEpisodeToDB(anime.anilistId, episodeResults)
        if (anime.status === "FINISHED") {
          console.log("Bo nay da ket thuc")
          await saveFinishedAnime(anime)
        }
        else if (anime.status === "RELEASING") {
          console.log("Bo nay chua ketthuc ket thuc")
          await saveReleasingAnime(anime)
        }
      }
      await sleep(1500)
    }
  } catch (error) {
    console.log(error)
  }

}

const handleAsync = async (config) => {
  await ConnectModel(config)
  await botCheckAnime()

}
export default handleAsync
