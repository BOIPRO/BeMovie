import * as crypto from 'node:crypto';
import axios from 'axios';
const _0x2b5116 = {
  url: "https://stream.googleapiscdn.com/hls/69d521bb63e2619f82e2efbd.ts?e=rXuDTNRhJNpVhDQKr66P7s-gNWyE4q1u52PDnuGwDb7xWwRlxBVO9icWW6V9Jvl8Qm0ahKWd84qBDhTOKJruJcFJbzHxxI6_gkUhiHuMqqAZkNPgS_UgrLCbTuobFg2Fwwh_5h4qiiic56cjugCuWZrGS1sDwHphz-JCYhhCHC1elaeoP0XgtSukX_NyQ7yfteb4swd3ymf9xxzy_H6Usw&i=291&t=1782295078&ct=1782295078624&dt=a87694d9&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdnMtdXNlciIsImlzcyI6ImF2cy1hdXRoIiwiaWF0IjoxNzgyMjk1MDc2LCJleHAiOjE3ODIzMDIyNzYsImp0aSI6Ijg2M2U3ZmQ3OTBmOTkyY2M1OWFkZWFjMDBmMmExYThlOGQ5ZjIwMzYzOTM1NDljNjJhMzE4MTYyMDdiOTY2ZmQyZjBlNzJlMGU3MzczMGYxZGZhNDAxOGE4NzM1NjUzYzdiOWYxMTVlNTE2ZDZiNGIzM2VmODcwNTgyOGYwMjU1In0.MWlZrxZhBkCUFf1bpJ-tdU_shregYtyU9vBYBTQ8Hpg"
}
const urlherft = "https://storage.googleapiscdn.com/player/b281711c05eba12ec5e1b98267b7b862c96bf3d85d64d5089320b412136e2ab6?nextName=02&nextUrl=https%3A%2F%2Fanimevietsub.pl%2Fphim%2Fclass-de-2-banme-ni-kawaii-onnanoko-to-tomodachi-ni-natta-a5907%2Ftap-02-112899.html"
function _0xc8ecf2(_0x538cb7) {
  _0x313efc = function (_0x34790d) {
    var _0xfdeb8a = 2166136261;
    for (var _0x58207e = 0; _0x58207e < _0x34790d.length; _0x58207e++) {
      _0xfdeb8a = (_0xfdeb8a ^ 255 & _0x34790d.charCodeAt(_0x58207e)) >>> 0;
      _0xfdeb8a = Math.imul(_0xfdeb8a, 16777619) >>> 0;
    }
    return _0xfdeb8a >>> 0;
  }(String(_0x538cb7));
  _0x82d838 = _0x313efc >>> 0 || 1;
  return function () {
    _0x82d838 ^= _0x82d838 << 13;
    _0x82d838 >>>= 0;
    _0x82d838 ^= _0x82d838 >>> 17;
    _0x82d838 >>>= 0;
    _0x82d838 ^= _0x82d838 << 5;
    return _0x82d838 >>>= 0;
  };
  var _0x313efc;
  var _0x82d838;
}
function _0x27da8e(_0x2e430a, _0x274443, _0x437fd4) {
  var _0x53a89c = _0x2e430a instanceof Uint8Array ? _0x2e430a : new Uint8Array(_0x2e430a);
  var _0x3ff44b = _0x53a89c.length;
  var _0x5d849f = new Uint8Array(_0x3ff44b);
  if (0 === _0x3ff44b) {
    return _0x5d849f.buffer;
  }
  var _0x144c3f = _0xc8ecf2(_0x274443 + "|" + _0x437fd4);
  var _0x114b18 = function (_0x560b5d, _0x502aa2) {
    var _0x354d20 = new Uint32Array(_0x502aa2);
    for (var _0x47db82 = 0; _0x47db82 < _0x502aa2; _0x47db82++) {
      _0x354d20[_0x47db82] = _0x47db82;
    }
    for (var _0x2fdd73 = _0x502aa2 - 1; _0x2fdd73 > 0; _0x2fdd73--) {
      var _0x378ed4 = _0x560b5d() % (_0x2fdd73 + 1);
      var _0x4bf5f8 = _0x354d20[_0x2fdd73];
      _0x354d20[_0x2fdd73] = _0x354d20[_0x378ed4];
      _0x354d20[_0x378ed4] = _0x4bf5f8;
    }
    return _0x354d20;
  }(_0x144c3f, _0x3ff44b);
  var _0x376c7d = 0;
  for (var _0x3f8260 = 0; _0x3f8260 < _0x3ff44b; _0x3f8260++) {
    if (!(3 & _0x3f8260)) {
      _0x376c7d = _0x144c3f();
    }
    _0x5d849f[_0x114b18[_0x3f8260]] = _0x53a89c[_0x3f8260] ^ _0x376c7d >>> 8 * (3 & _0x3f8260) & 255;
  }
  return _0x5d849f.buffer;
}
function _0x54ee15(_0x242c9e) {
  if (!_0x242c9e || "string" != typeof _0x242c9e) {
    return '';
  }
  var _0xd74a4b = _0x242c9e.split(".");
  if (3 !== _0xd74a4b.length) {
    return '';
  }
  for (var _0xd1c1da = _0xd74a4b[1].replace(/-/g, "+").replace(/_/g, "/"); _0xd1c1da.length % 4;) {
    _0xd1c1da += "=";
  }
  try {
    var _0x503ad8 = JSON.parse(atob(_0xd1c1da));
    var _0x464ca1 = _0x503ad8 && _0x503ad8.jti;
    if ("string" != typeof _0x464ca1) {
      return '';
    }
    var _0x3ee61a = '';
    for (var _0x53adf7 = 0; _0x53adf7 < _0x464ca1.length; _0x53adf7++) {
      if (_0x53adf7 % 2 == 1) {
        _0x3ee61a += _0x464ca1[_0x53adf7];
      }
    }
    return _0x3ee61a;
  } catch (_0x192011) {
    return '';
  }
}
var avskToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdnMtdXNlciIsImlzcyI6ImF2cy1hdXRoIiwiaWF0IjoxNzgyMzU2NDkyLCJleHAiOjE3ODIzNjM2OTIsImp0aSI6IjZjZDBjZWM5NTZiMWQ3N2IzMzkyMWY5NjAyOWNlOTYyY2Y2NWY0NTk2MjUwZWQxMzA1MTg4ZmJjY2Y2MmFhMDk1ZTgxY2M0N2IxODFiYjdjODFiOTdiMGE5MmVhY2FmMWNjYmVlZTgzNGRlYjQxNTczYjk0NjY3ZjRkMjAyMzM5In0.jTjbMofrQhfDr_SzVo0oOuERbU3KgmFl2zrxiZbmSSA"
var _0x33d36d = _0x54ee15(avskToken)
console.log(_0x33d36d)
// if (!_0x33d36d) {
//   try {
//     var _0x1e619a = (_0x2f22d7.location && _0x2f22d7.location.search ? _0x2f22d7.location.search.substring(1) : '').split("&");
//     for (var _0x174e85 = 0; _0x174e85 < _0x1e619a.length; _0x174e85++) {
//       var _0x3dad3a = _0x1e619a[_0x174e85].indexOf("=");
//       if (!(_0x3dad3a < 0) && "token" === _0x1e619a[_0x174e85].substring(0, _0x3dad3a)) {
//         _0x33d36d = _0x54ee15(decodeURIComponent(_0x1e619a[_0x174e85].substring(_0x3dad3a + 1)));
//         break;
//       }
//     }
//   } catch (_0x2922dc) { }
// }
var _0x238867 = null;
var _0x541dda = '';
var _0xe8bbb7 = /\/hls\/([0-9a-f]{24})\.ts(?:$|\?)/i;
var _0x19de61 = {
  sessionKey: ''
};
_0x19de61.hasCrypto = false;
_0x19de61.placeholderSeen = 0x0;
_0x19de61.decryptOK = 0x0;
_0x19de61.decryptFail = 0x0;
_0x19de61.rewroteToCdn = 0x0;
_0x19de61.fallthroughPlaceholder = 0x0;
_0x19de61.lastError = '';
_0x19de61.sessionKey = _0x33d36d ? "present(" + _0x33d36d.length + ")" : "MISSING";
console.log(_0x19de61)
try {
  var _0x542873 = new URL(_0x2b5116.url, urlherft);
  var _0x4b230e = _0xe8bbb7.exec(_0x542873.pathname);
  console.log(_0x4b230e)
  if (_0x4b230e) {
    if (_0x33d36d) {
      var _0x4a8339 = _0x4b230e[1];
      var _0x3760a4 = _0x542873.searchParams.get("e");
      var _0x3d515f = parseInt(_0x542873.searchParams.get("i"), 10);
      if (_0x3760a4) {
        if (!Number.isFinite(_0x3d515f) || _0x3d515f < 0) {
          _0x541dda = "bad_i_param";
        } else {
          _0x238867 = {
            "fileId": _0x4a8339,
            "e": _0x3760a4,
            "i": _0x3d515f
          };
        }
      } else {
        _0x541dda = "no_e_param";
      }
    } else {
      _0x541dda = "no_sessionkey";
    }

  }
  console.log(_0x238867)
} catch (_0x5765f4) {
  _0x541dda = ("parse_err:" + _0x5765f4 && _0x5765f4.message || "?");
  _0x238867 = null;
}

// 1. Phân tách URL
const url = new URL(_0x2b5116.url);
const params = new URLSearchParams(url.search);

// 2. Lấy thông tin
const segmentId = params.get('i'); // Lấy ID (ví dụ: 291)
const dt = params.get('dt');       // Lấy Metadata (ví dụ: a87694d9)
const token = params.get('token'); // Lấy JWT
function _0x4d5e34(_0x3a3f0c) {
  if ("string" != typeof _0x3a3f0c || 0 === _0x3a3f0c.length || _0x3a3f0c.length % 2 != 0) {
    return null;
  }
  var _0x13db42 = new Uint8Array(_0x3a3f0c.length >> 1);
  for (var _0x14737d = 0; _0x14737d < _0x13db42.length; _0x14737d++) {
    var _0xcfdbde = _0x3a3f0c.charCodeAt(2 * _0x14737d);
    var _0x93952a = _0x3a3f0c.charCodeAt(2 * _0x14737d + 1);
    var _0x108371 = _0xcfdbde < 58 ? _0xcfdbde - 48 : _0xcfdbde < 97 ? _0xcfdbde - 55 : _0xcfdbde - 87;
    var _0x1d5bd3 = _0x93952a < 58 ? _0x93952a - 48 : _0x93952a < 97 ? _0x93952a - 55 : _0x93952a - 87;
    if (_0x108371 < 0 || _0x108371 > 15 || _0x1d5bd3 < 0 || _0x1d5bd3 > 15) {
      return null;
    }
    _0x13db42[_0x14737d] = _0x108371 << 4 | _0x1d5bd3;
  }
  return _0x13db42;
}
function _0x52121c(_0x1ed8a8, _0x498331) {
  var _0x46371c = new TextEncoder().encode(_0x498331);
  return crypto.subtle.importKey("raw", _0x1ed8a8, {
    "name": "HMAC",
    "hash": "SHA-256"
  }, false, ["sign"]).then(function (_0x9854ac) {
    return crypto.subtle.sign("HMAC", _0x9854ac, _0x46371c);
  }).then(function (_0x110416) {
    return new Uint8Array(_0x110416);
  });
}
const avsDeriveSegKey = (_0x287dc6, _0x2af81e, _0x4cddaf) => {
  var _0x4c5902 = "string" == typeof _0x287dc6 ? _0x4d5e34(_0x287dc6) : _0x287dc6;
  return _0x4c5902 && 32 === _0x4c5902.length ? _0x52121c(_0x4c5902, "seg:" + _0x2af81e + ":" + _0x4cddaf).then(function (_0x4c49bd) {
    return _0x4c49bd.slice(0, 16);
  }) : Promise.reject(new Error("_avsDeriveSegKey: sk must be 32 bytes"));
};
const avsDeriveSegIv = (_0xf5aa4e, _0x5f504d, _0x4a33d9) => {
  var _0x29b76c = "string" == typeof _0xf5aa4e ? _0x4d5e34(_0xf5aa4e) : _0xf5aa4e;
  return _0x29b76c && 32 === _0x29b76c.length ? _0x52121c(_0x29b76c, "iv:" + _0x5f504d + ":" + _0x4a33d9).then(function (_0x5d347e) {
    console.log(_0x5d347e.slice(0, 16))
    return _0x5d347e.slice(0, 16);
  }) : Promise.reject(new Error("_avsDeriveSegIv: sk must be 32 bytes"));
};
var iv = await avsDeriveSegIv(_0x33d36d, segmentId, dt)
var segkey = await avsDeriveSegKey(_0x33d36d, segmentId, dt)
console.log('iv : ', iv)
console.log('segkey : ', segkey)
async function newUrlSeg(_0x3f33b4, _0x4e8a87, _0x582b75, _0x5daef6) {
  var _0x11933d = await async function (_0x5becfe, _0x3118c4) {
    // var _0x44082e = _0x268253.get(_0x3118c4);
    // if (_0x44082e) {
    //   return _0x44082e;
    // }
    var _0x4266c9 = new TextEncoder();
    var _0x2fc475 = await crypto.subtle.importKey("raw", _0x4266c9.encode(_0x5becfe), {
      "name": "HMAC",
      "hash": "SHA-256"
    }, false, ["sign"]);
    var _0x5ba3aa = await crypto.subtle.sign("HMAC", _0x2fc475, _0x4266c9.encode(("url-cipher|" + _0x3118c4)));
    var _0x484d1b = await crypto.subtle.importKey("raw", _0x5ba3aa, {
      "name": "AES-CTR"
    }, false, ["decrypt"]);
    // _0x268253.set(_0x3118c4, _0x484d1b);
    return _0x484d1b;
  }(_0x3f33b4, _0x4e8a87);
  var _0x3dfe4a = new Uint8Array(16);
  _0x3dfe4a[12] = ((_0x582b75 >>> 24) & 255);
  _0x3dfe4a[13] = (_0x582b75 >>> 16 & 255);
  _0x3dfe4a[14] = ((_0x582b75 >>> 8) & 255);
  _0x3dfe4a[15] = (255 & _0x582b75);
  for (var _0x3a6574 = _0x5daef6.replace(/-/g, "+").replace(/_/g, "/"); (_0x3a6574.length % 4);) {
    _0x3a6574 += "=";
  }
  var _0x350f09 = atob(_0x3a6574);
  var _0x96815e = new Uint8Array(_0x350f09.length);
  for (let i = 0; (i < _0x350f09.length); i++) {
    _0x96815e[i] = _0x350f09.charCodeAt(i);
  }
  var keys = {
    "enable": true,
    "permKey": "LFH82ccwBjtnt5_XjjgYgMaPxOhTNd29VqqOEv2egFw",
    "permSalt": String("LFH82ccwBjtnt5_XjjgYgMaPxOhTNd29VqqOEv2egFw")
  }
  var _0x194d3b = {
    name: "AES-CTR",
    counter: _0x3dfe4a,
    length: 0x40
  };
  var _0x49e72d = await crypto.subtle.decrypt(_0x194d3b, _0x11933d, _0x96815e);
  _0x49e72d = _0x27da8e(_0x49e72d, keys.permKey, keys.permSalt)
  console.log(new TextDecoder().decode(new Uint8Array(_0x49e72d)))
  return new TextDecoder().decode(new Uint8Array(_0x49e72d));
  //_0x33d36d  la session key 
}
const fectseg = async (urlSeg) => {
  const API_URL = urlSeg
  const baseHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': "https://storage.googleapiscdn.com",
    'Origin': "https://storage.googleapiscdn.com"

  };
  try {
    const response = await axios.get(API_URL, {
      headers: baseHeaders,
      responseType: 'arraybuffer',
      decompress: true
    });
    const bufferData = Buffer.from(response.data);
    const key = Buffer.from(segkey);
    const ivkey = Buffer.from(iv);
    // const startTs = bufferData.indexOf(0x47);
    // const encryptedData = bufferData.slice(startTs);
    const decipher = crypto.createDecipheriv('aes-128-gcm', key, ivkey)
    let decrypted = Buffer.concat([decipher.update(bufferData), decipher.final()]);
    console.log("Byte đầu tiên:", decrypted[0].toString(16));
  }
  catch (error) {
    if (error.response) {
      console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
    } else {
      console.error(" Lỗi kết nối AJAX:", error.message);
    }
  }
}
const run = async () => {
  const url = "https://lh3.googleusercontent.com/gOsw5WBWsAvbbGIMvbds1Gr-dkbQS1k8gthQodgPdBeOHffKS6yFw9EDW2l4sBvPr8Gy66bzLS7an2roCCZTNatnC1uQHsvT23bQC91xQkM5BVGf9TO7xH7v92gl-w=d"
  console.log(url)
  await fectseg(url)
}
export default run