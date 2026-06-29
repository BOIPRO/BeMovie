import axios from 'axios';
import * as crypto from 'node:crypto';
const avsDomain = [[97, 110, 105, 109, 101, 118, 105, 101, 116, 115, 117, 98, 46, 114, 117], [97, 110, 105, 109, 101, 118, 105, 101, 116, 115, 117, 98, 46, 112, 108], [97, 110, 105, 109, 101, 118, 105, 101, 116, 115, 117, 98, 46, 105, 100], [97, 110, 105, 109, 101, 118, 105, 101, 116, 115, 117, 98, 46, 98, 121], [97, 110, 105, 109, 101, 118, 105, 101, 116, 115, 117, 98, 46, 110, 97, 109, 101], [97, 110, 105, 109, 101, 118, 105, 101, 116, 115, 117, 98, 46, 115, 105, 116, 101], [108, 111, 99, 97, 108, 104, 111, 115, 116], [115, 116, 114, 101, 97, 109, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 99, 100, 110, 46, 99, 111, 109], [105, 102, 114, 97, 109, 101, 116, 101, 115, 116, 101, 114, 46, 99, 111, 109], [115, 116, 111, 114, 97, 103, 101, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 99, 100, 110, 46, 99, 111, 109]];
// BẮT BUỘC: Bạn phải copy định nghĩa hàm _0xc8ecf2 từ trên web bỏ vào đây thì code mới chạy được
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
// HÀM GIẢI MÃ SAU KHI BỎ RÂU RIA VÀ GIỮ NGUYÊN TÊN BIẾN
function decryptCrypto(_0x467925, _0x14d047, _0x3330c5) {
    var _0x6ba5f6 = null;
    try {
        _0x6ba5f6 = _0x258e71.get(_0x14d047);
    } catch (_0x2de826) { }
    var _0x446fda = _0x467925 && _0x467925.name;
    var _0x4994c5 = _0x6ba5f6 && _0x6ba5f6.enable && ("AES-GCM" === _0x446fda || "AES-CTR" === _0x446fda);
    return _0x357664(_0x467925, _0x14d047, _0x3330c5).then(function (_0x58d6cd) {
        if (_0x4994c5) {
            //   try {
            //     // if ("function" == typeof _0x2f22d7._avsHardenOkInc) {
            //     //   _0x2f22d7._avsHardenOkInc();
            //     // }
            //   } catch (_0x1d584a) {}
            return _0x27da8e(_0x58d6cd, _0x6ba5f6.permKey, _0x6ba5f6.permSalt);
        }
        return _0x58d6cd;
    }, function (_0x8c2540) {
        if (_0x4994c5 && _0x8c2540 && ("OperationError" === _0x8c2540.name || /tag/i.test(String(_0x8c2540 && _0x8c2540.message)))) {
            var _0x33d55b = _0x3330c5 && _0x3330c5.byteLength || _0x3330c5 && _0x3330c5.length || 0;
            return function (_0x487823, _0x270f83) {
                var _0x4304c6 = _0xc8ecf2(_0x270f83);
                var _0x17b5e0 = new Uint8Array(_0x487823);
                var _0x53c0aa = 0;
                for (var _0x2a70af = 0; _0x2a70af < _0x487823; _0x2a70af++) {
                    if (!(3 & _0x2a70af)) {
                        _0x53c0aa = _0x4304c6();
                    }
                    _0x17b5e0[_0x2a70af] = _0x53c0aa >>> 8 * (3 & _0x2a70af) & 255;
                }
                return _0x17b5e0.buffer;
            }(Math.max(0, _0x33d55b - 16), String(_0x446fda || "unknown") + ":" + String(_0x6ba5f6.permKey) + ":" + String(_0x6ba5f6.permSalt) + ":" + _0x33d55b + ":noise");
        }
        throw _0x8c2540;
    });
}
function _0x45ff42(_0x5f4670) {
    if (!_0x5841db) {
        _0x5841db = new Uint32Array(256);
        for (var _0x57ff57 = 0; _0x57ff57 < 256; _0x57ff57++) {
            var _0xee8183 = _0x57ff57;
            for (var _0x151274 = 0; _0x151274 < 8; _0x151274++) {
                _0xee8183 = 1 & _0xee8183 ? 3988292384 ^ _0xee8183 >>> 1 : _0xee8183 >>> 1;
            }
            _0x5841db[_0x57ff57] = _0xee8183 >>> 0;
        }
    }
    var _0x1c6673 = 4294967295;
    for (var _0x15ca78 = 0; _0x15ca78 < _0x5f4670.length; _0x15ca78++) {
        _0x1c6673 = (_0x5841db[255 & (_0x1c6673 ^ _0x5f4670[_0x15ca78])] ^ _0x1c6673 >>> 8) >>> 0;
    }
    return (4294967295 ^ _0x1c6673) >>> 0;
}
function _0x2df12e(_0x287faa) {
    var _0x479eee = _0x287faa.replace(/-/g, "+").replace(/_/g, "/");
    _0x479eee += "==".slice(0, (4 - _0x479eee.length % 4) % 4);
    var _0x497f1f = atob(_0x479eee);
    var _0x2109cb = new Uint8Array(_0x497f1f.length);
    for (var _0x2a39fb = 0; _0x2a39fb < _0x497f1f.length; _0x2a39fb++) {
        _0x2109cb[_0x2a39fb] = _0x497f1f.charCodeAt(_0x2a39fb);
    }
    return _0x2109cb;
}
async function _0x12dd0e(_0x2f71a3, _0x28a99b, _0x3d57b5, _0x174697, _0x37765c) {
    var _0x50e520 = {
        name: "HMAC",
        hash: "SHA-256"
    };
    var _0x4d6e3a;
    var _0x1d9033 = _0x2df12e(_0x28a99b);
    var _0x157cf8 = await crypto.subtle.importKey("raw", _0x1d9033, _0x50e520, false, ["sign"]);
    var _0x111a49 = true
    var _0x9f4c99 = true
    var _0x10ac24 = 0
    var _0x5cbc09 = _0x111a49 && !_0x9f4c99 ? _0x10ac24 : 0;
    if (_0x111a49) {
        _0x4d6e3a = new TextEncoder().encode(_0x174697 + ":" + _0x37765c + ":" + _0x3d57b5 + ":" + _0x5cbc09);
        // if (_0x9f4c99 && (0 !== _0x10ac24 || Math.random() < 0.05)) {
        //     _0x2f12c6("envSnap", {
        //         "value": _0x10ac24,
        //         "ua": (navigator.userAgent || '').slice(0, 100),
        //         "sampled": 0 === _0x10ac24
        //     });
        // }
    } else {
        _0x4d6e3a = new TextEncoder().encode(_0x174697 + ":" + _0x37765c + ":" + _0x3d57b5);
    }
    console.log(_0x4d6e3a)
    var _0x33bf90 = await crypto.subtle.sign("HMAC", _0x157cf8, _0x4d6e3a);
    var keys = {
        "enable": true,
        "permKey": _0x3d57b5,
        "permSalt": String(_0x37765c)
    }
    var _0x32cf1e = await crypto.subtle.importKey("raw", _0x33bf90, {
        "name": "AES-GCM"
    }, false, ["decrypt"]);
    console.log(_0x32cf1e)
    // if (_0x111a49) {
    //     _0x2f22d7._avsMarkKey(_0x32cf1e, {
    //         "enable": true,
    //         "permKey": _0x3d57b5,
    //         "permSalt": String(_0x37765c)
    //     });
    // }
    var _0x101b87 = _0x1d9033.slice(0, 12);
    console.log(_0x1d9033)
    console.log(_0x101b87)
    var _0x3fcb59 = _0x2df12e(_0x2f71a3);
    console.log(_0x3fcb59)
    var _0x5df9d5 = await crypto.subtle.decrypt({
        "name": "AES-GCM",
        "iv": _0x101b87
    }, _0x32cf1e, _0x3fcb59);
    var _0x5df9d5 = _0x27da8e(_0x5df9d5, keys.permKey, keys.permSalt)
    console.log(_0x5df9d5)
    console.log(new TextDecoder().decode(_0x5df9d5))
    return new TextDecoder().decode(_0x5df9d5);
}
function _0x3bceb5(_0xa0fd4, _0x20d139) {
    try {
        var _0x2dec78 = _0xa0fd4.split('');
        var _0x2e01dd = _0x2dec78.length;
        var _0x418629 = parseInt(_0x20d139.substring(0, 8), 16) >>> 0;
        var _0x56aa23 = [];
        for (var _0x291c99 = _0x2e01dd - 1; _0x291c99 > 0; _0x291c99--) {
            _0x418629 = Math.imul(_0x418629, 1664525) + 1013904223 >>> 0;
            _0x56aa23.push([_0x291c99, _0x418629 % (_0x291c99 + 1)]);
        }
        for (var _0x2ddb9b = _0x56aa23.length - 1; _0x2ddb9b >= 0; _0x2ddb9b--) {
            var _0x3c9c83 = _0x56aa23[_0x2ddb9b];
            var _0x2582a0 = _0x2dec78[_0x3c9c83[0]];
            _0x2dec78[_0x3c9c83[0]] = _0x2dec78[_0x3c9c83[1]];
            _0x2dec78[_0x3c9c83[1]] = _0x2582a0;
        }
        return _0x2dec78.join('');
    } catch (_0x418ba3) {
        return _0xa0fd4;
    }
}
function _0x162254(_0x1a6d8a) {
    var _0x3b6538 = _0x1a6d8a.replace(/-/g, "+").replace(/_/g, "/");
    _0x3b6538 += "==".slice(0, (4 - _0x3b6538.length % 4) % 4);
    var _0x1b5728 = atob(_0x3b6538);
    var _0x4d59aa = new Uint8Array(_0x1b5728.length);
    for (var _0x58760c = 0; _0x58760c < _0x1b5728.length; _0x58760c++) {
        _0x4d59aa[_0x58760c] = _0x1b5728.charCodeAt(_0x58760c);
    }
    if (_0x4d59aa.length < 11) {
        throw new Error("Envelope too short");
    }
    if (85 !== _0x4d59aa[0] || 83 !== _0x4d59aa[1] || 68 !== _0x4d59aa[2] || 75 !== _0x4d59aa[3]) {
        throw new Error("Bad magic");
    }
    if (1 !== _0x4d59aa[4]) {
        throw new Error("Unsupported envelope version: " + _0x4d59aa[4]);
    }
    var _0x5b6338 = _0x4d59aa[5] << 8 | _0x4d59aa[6];
    if (_0x4d59aa.length < 7 + _0x5b6338 + 4) {
        throw new Error("Envelope length mismatch");
    }
    var _0x35bfa8 = _0x4d59aa.subarray(7, 7 + _0x5b6338);
    if ((_0x4d59aa[7 + _0x5b6338] << 24 | _0x4d59aa[7 + _0x5b6338 + 1] << 16 | _0x4d59aa[7 + _0x5b6338 + 2] << 8 | _0x4d59aa[7 + _0x5b6338 + 3]) >>> 0 !== _0x45ff42(_0x35bfa8)) {
        throw new Error("CRC mismatch");
    }
    var _0x4e6df9 = '';
    for (var _0x3295b8 = 0; _0x3295b8 < _0x35bfa8.length; _0x3295b8++) {
        _0x4e6df9 += String.fromCharCode(_0x35bfa8[_0x3295b8]);
    }
    _0x4e6df9 = decodeURIComponent(escape(_0x4e6df9));
    return JSON.parse(_0x4e6df9);
}
async function _0x1cf828(_0x543a5d, headers) {

    var _0x1cc54a;
    var _0x593e14;
    var _0x1a2584;
    var _0x4dcea4;
    var _0x1c2125 = _0x543a5d;
    var _0x226538 = headers["x-envelop"]
    var _0x1719c9 = null;
    if (_0x226538) {
        try {
            _0x1719c9 = _0x162254(_0x226538);
        } catch (_0x2e05d5) {
            console.log(_0x2e05d5)
        }
    }
    if (_0x1719c9) {
        _0x1cc54a = _0x1719c9.cn;
        _0x593e14 = _0x1719c9.sk;
        _0x1a2584 = _0x1719c9.ts || "0";
        _0x4dcea4 = _0x1719c9.uid || "anon";
    } else {
        _0x1cc54a = headers["x-edge-tag"] || ""
        _0x593e14 = headers["x-cache-node"] || ""
        _0x1a2584 = headers["x-request-trace"] || "0"
        _0x4dcea4 = decodeURIComponent((headers["x-proxy-digest"] || '') || "anon");
    }
    console.log(_0x1cc54a)
    console.log(_0x593e14)
    console.log(_0x1a2584)
    console.log(_0x4dcea4)
    var _0x2a9ffb = [];
    var _0x3de6e8 = [];
    var _0x20cca0 = _0x1c2125.split("\n");
    var _0x4ae047 = false;
    for (var _0x3df921 = 0; _0x3df921 < _0x20cca0.length; _0x3df921++) {
        var _0x1ca8dc = _0x20cca0[_0x3df921];
        if (!_0x1ca8dc.startsWith("#") && '' !== _0x1ca8dc.trim()) {
            if (_0x1ca8dc.match(/[?&]_c=[0-9]+/)) {
                _0x4ae047 = true;
            }
            break;
        }
    }
    _0x20cca0.forEach(function (_0x1f4f68) {
        if (_0x1f4f68.startsWith("#") || '' === _0x1f4f68.trim()) {
            if (!(_0x1f4f68.match(/^#EXTINF:/) || _0x1f4f68.match(/^#EXT-X-ENDLIST/) || _0x1f4f68.match(/^#EXT-X-KEY/))) {
                _0x3de6e8.push(_0x1f4f68);
            }
        } else {
            var _0x1fce36 = _0x1f4f68.match(/[?&]_t=([^&\s]+)/);
            if (_0x1fce36) {
                _0x2a9ffb.push(_0x1fce36[1]);
            }
        }
    });
    var _0x324200 = _0x2a9ffb.join('');
    await _0x12dd0e(_0x324200 = _0x3bceb5(_0x324200, _0x593e14), _0x1cc54a, _0x593e14, _0x4dcea4, _0x1a2584).then(function (_0x1570fc) {
        _0x543a5d = _0x3de6e8.join("\n") + "\n" + _0x1570fc;
    }).catch(function (err) {
        console.log(err)
    })
    // _0x468058.onSuccess(_0x543a5d, _0x2094fc, _0x4fbdd9, _0x5b8f55);
    // })["catch"](function (_0x4e6b99) {
    //     _0x468058.onError({
    //         "code": 0x0,
    //         "text": "AVS decrypt failed: " + _0x4e6b99.message
    //     }, _0x4fbdd9, null, _0x2094fc);
    // });

}
function _0x334cc6(_0x166d5f) {
    try {
        var _0x12d788;
        var _0x318b75 = avsDomain || [];
        var _0x4e546f = false;
        for (var _0x10ea81 = 0; _0x10ea81 < _0x318b75.length; _0x10ea81++) {
            var _0x2804df = _0x318b75[_0x10ea81];
            var _0x59a743 = '';
            for (var _0x41273d = 0; _0x41273d < _0x2804df.length; _0x41273d++) {
                _0x59a743 += String.fromCharCode(_0x2804df[_0x41273d]);
            }
        }
        if (_0x4e546f) {
            _0x12d788 = 127;
        } else {
            var _0xb57ed = 0;
            var _0x1b6186 = Math.min(_0xf0ed39.length, 8);
            for (var _0x3b2550 = 0; _0x3b2550 < _0x1b6186; _0x3b2550++) {
                _0xb57ed += _0xf0ed39.charCodeAt(_0x3b2550);
            }
            _0x12d788 = 127 + _0xb57ed;
        }
        return _0x166d5f.slice(_0x12d788);
    } catch (_0x4a65a2) {
        return _0x166d5f.slice(127);
    }
}
function SliceData(_0x577c43) {
    try {
        var _0x54865c;
        var _0x1247cc = _0x577c43 && _0x577c43;
        console.log(_0x1247cc instanceof ArrayBuffer)
        if (_0x1247cc) {
            console.log(1)
            _0x54865c = _0x334cc6(new Uint8Array(_0x1247cc));
            _0x577c43 = _0x54865c.buffer.slice(_0x54865c.byteOffset, _0x54865c.byteOffset + _0x54865c.byteLength);
            return _0x577c43
            // } else if (null != _0x1247cc.byteLength) {
            //     console.log("Vao day roi")
            //     _0x54865c = _0x334cc6(_0x1247cc);
            //     _0x577c43 = _0x54865c;
            //     console.log(_0x577c43.data)

            // }
        }
    } catch (_0x365d3c) {
        console.log(_0x365d3c)
    }
}
const getencryptM3u8 = async () => {
    const API_URL = "https://storage.googleapiscdn.com/playlist/e4ae0579b03286969c6b971065ae260ff5e005fcbf3e9311b294f0f450acb64b/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdnMtdXNlciIsImlzcyI6ImF2cy1hdXRoIiwiaWF0IjoxNzgyNTI4MzExLCJleHAiOjE3ODI1MzU1MTEsImp0aSI6IjZmZjQyYWI1MGM5NDljNzQ2ZTJiNDIwNmRlNzcxNDZiOGYxNjAzMjBlYjk0MGM0NGUzZWY0OTVkMjgzODFmZmM0ODA0YTAwZmE5OTFkYmVmZDJhZmMzOWI1YTUwN2I0YjJkYzNiMTEwZGZjNWFhOGNjYmJmNjZjY2UwM2NjYWI1In0.D1bU-_8JSYZEmecGVpyorPN-o957Nv8jcfhi30LiTug&fc=Y3Jvc3Mtb3JpZ2lu"
    const baseHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': "https://storage.googleapiscdn.com/player/e4ae0579b03286969c6b971065ae260ff5e005fcbf3e9311b294f0f450acb64b"

    };
    try {
        const response = await axios.get(API_URL, {
            headers: baseHeaders,
            responseType: 'arraybuffer',
            decompress: true
        });
        return response
    }
    catch (error) {
        if (error.response) {
            console.error(`Lỗi từ phía Server (${error.response.status}):`, error.response.data);
        } else {
            console.error(" Lỗi kết nối AJAX:", error.message);
        }
    }
}
// const _0x2b5116 = {
//     url: "https://stream.googleapiscdn.com/hls/69d521bb63e2619f82e2efbd.ts?e=rXuDTNRhJNpVhDQKr66P7s-gNWyE4q1u52PDnuGwDb7xWwRlxBVO9icWW6V9Jvl8Qm0ahKWd84qBDhTOKJruJcFJbzHxxI6_gkUhiHuMqqAZkNPgS_UgrLCbTuobFg2Fwwh_5h4qiiic56cjugCuWZrGS1sDwHphz-JCYhhCHC1elaeoP0XgtSukX_NyQ7yfteb4swd3ymf9xxzy_H6Usw&i=291&t=1782295078&ct=1782295078624&dt=a87694d9&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdnMtdXNlciIsImlzcyI6ImF2cy1hdXRoIiwiaWF0IjoxNzgyMjk1MDc2LCJleHAiOjE3ODIzMDIyNzYsImp0aSI6Ijg2M2U3ZmQ3OTBmOTkyY2M1OWFkZWFjMDBmMmExYThlOGQ5ZjIwMzYzOTM1NDljNjJhMzE4MTYyMDdiOTY2ZmQyZjBlNzJlMGU3MzczMGYxZGZhNDAxOGE4NzM1NjUzYzdiOWYxMTVlNTE2ZDZiNGIzM2VmODcwNTgyOGYwMjU1In0.MWlZrxZhBkCUFf1bpJ-tdU_shregYtyU9vBYBTQ8Hpg"
// }
// const urlherft = "https://storage.googleapiscdn.com/player/b281711c05eba12ec5e1b98267b7b862c96bf3d85d64d5089320b412136e2ab6?nextName=02&nextUrl=https%3A%2F%2Fanimevietsub.pl%2Fphim%2Fclass-de-2-banme-ni-kawaii-onnanoko-to-tomodachi-ni-natta-a5907%2Ftap-02-112899.html"
// function _0x54ee15(_0x242c9e) {
//     if (!_0x242c9e || "string" != typeof _0x242c9e) {
//         return '';
//     }
//     var _0xd74a4b = _0x242c9e.split(".");
//     if (3 !== _0xd74a4b.length) {
//         return '';
//     }
//     for (var _0xd1c1da = _0xd74a4b[1].replace(/-/g, "+").replace(/_/g, "/"); _0xd1c1da.length % 4;) {
//         _0xd1c1da += "=";
//     }
//     try {
//         var _0x503ad8 = JSON.parse(atob(_0xd1c1da));
//         var _0x464ca1 = _0x503ad8 && _0x503ad8.jti;
//         if ("string" != typeof _0x464ca1) {
//             return '';
//         }
//         var _0x3ee61a = '';
//         for (var _0x53adf7 = 0; _0x53adf7 < _0x464ca1.length; _0x53adf7++) {
//             if (_0x53adf7 % 2 == 1) {
//                 _0x3ee61a += _0x464ca1[_0x53adf7];
//             }
//         }
//         return _0x3ee61a;
//     } catch (_0x192011) {
//         return '';
//     }
// }
// var avskToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdnMtdXNlciIsImlzcyI6ImF2cy1hdXRoIiwiaWF0IjoxNzgyNTQ5MzI3LCJleHAiOjE3ODI1NTY1MjcsImp0aSI6Ijk3ODQwODQ1YmU0NzIzY2E2OWI2OTNhYzQ3MzMwZTdmMGE2OWUxZWJkZTY3OGJmOWJlZmQwNTJkODM3MDIxM2E3MWVlYjYzMjYyNWQ5ZjgyZGVlYmVjZjJkNDQ3YzY4MzBiYjMyYzdmZmU3YTEzMmQ3YzU4ZmUxZDcwOTlkNDFlIn0.55iu3ycUtIhvf5OpvSHkOoMLpZDVxKRSMa0w9xVeink"
// var _0x33d36d = _0x54ee15(avskToken)
// console.log(_0x33d36d)
// // if (!_0x33d36d) {
// //   try {
// //     var _0x1e619a = (_0x2f22d7.location && _0x2f22d7.location.search ? _0x2f22d7.location.search.substring(1) : '').split("&");
// //     for (var _0x174e85 = 0; _0x174e85 < _0x1e619a.length; _0x174e85++) {
// //       var _0x3dad3a = _0x1e619a[_0x174e85].indexOf("=");
// //       if (!(_0x3dad3a < 0) && "token" === _0x1e619a[_0x174e85].substring(0, _0x3dad3a)) {
// //         _0x33d36d = _0x54ee15(decodeURIComponent(_0x1e619a[_0x174e85].substring(_0x3dad3a + 1)));
// //         break;
// //       }
// //     }
// //   } catch (_0x2922dc) { }
// // }
// var _0x238867 = null;
// var _0x541dda = '';
// var _0xe8bbb7 = /\/hls\/([0-9a-f]{24})\.ts(?:$|\?)/i;
// var _0x19de61 = {
//     sessionKey: ''
// };
// _0x19de61.hasCrypto = false;
// _0x19de61.placeholderSeen = 0x0;
// _0x19de61.decryptOK = 0x0;
// _0x19de61.decryptFail = 0x0;
// _0x19de61.rewroteToCdn = 0x0;
// _0x19de61.fallthroughPlaceholder = 0x0;
// _0x19de61.lastError = '';
// _0x19de61.sessionKey = _0x33d36d ? "present(" + _0x33d36d.length + ")" : "MISSING";
// console.log(_0x19de61)
// try {
//     var _0x542873 = new URL(_0x2b5116.url, urlherft);
//     var _0x4b230e = _0xe8bbb7.exec(_0x542873.pathname);
//     console.log(_0x4b230e)
//     if (_0x4b230e) {
//         if (_0x33d36d) {
//             var _0x4a8339 = _0x4b230e[1];
//             var _0x3760a4 = _0x542873.searchParams.get("e");
//             var _0x3d515f = parseInt(_0x542873.searchParams.get("i"), 10);
//             if (_0x3760a4) {
//                 if (!Number.isFinite(_0x3d515f) || _0x3d515f < 0) {
//                     _0x541dda = "bad_i_param";
//                 } else {
//                     _0x238867 = {
//                         "fileId": _0x4a8339,
//                         "e": _0x3760a4,
//                         "i": _0x3d515f
//                     };
//                 }
//             } else {
//                 _0x541dda = "no_e_param";
//             }
//         } else {
//             _0x541dda = "no_sessionkey";
//         }

//     }
//     console.log(_0x238867)
// } catch (_0x5765f4) {
//     _0x541dda = ("parse_err:" + _0x5765f4 && _0x5765f4.message || "?");
//     _0x238867 = null;
// }

// // 1. Phân tách URL
// const url = new URL(_0x2b5116.url);
// const params = new URLSearchParams(url.search);

// // 2. Lấy thông tin
// const segmentId = params.get('i'); // Lấy ID (ví dụ: 291)
// const dt = params.get('dt');       // Lấy Metadata (ví dụ: a87694d9)
// const token = params.get('token'); // Lấy JWT
// function _0x4d5e34(_0x3a3f0c) {
//     if ("string" != typeof _0x3a3f0c || 0 === _0x3a3f0c.length || _0x3a3f0c.length % 2 != 0) {
//         return null;
//     }
//     var _0x13db42 = new Uint8Array(_0x3a3f0c.length >> 1);
//     for (var _0x14737d = 0; _0x14737d < _0x13db42.length; _0x14737d++) {
//         var _0xcfdbde = _0x3a3f0c.charCodeAt(2 * _0x14737d);
//         var _0x93952a = _0x3a3f0c.charCodeAt(2 * _0x14737d + 1);
//         var _0x108371 = _0xcfdbde < 58 ? _0xcfdbde - 48 : _0xcfdbde < 97 ? _0xcfdbde - 55 : _0xcfdbde - 87;
//         var _0x1d5bd3 = _0x93952a < 58 ? _0x93952a - 48 : _0x93952a < 97 ? _0x93952a - 55 : _0x93952a - 87;
//         if (_0x108371 < 0 || _0x108371 > 15 || _0x1d5bd3 < 0 || _0x1d5bd3 > 15) {
//             return null;
//         }
//         _0x13db42[_0x14737d] = _0x108371 << 4 | _0x1d5bd3;
//     }
//     return _0x13db42;
// }
// function _0x52121c(_0x1ed8a8, _0x498331) {
//     var _0x46371c = new TextEncoder().encode(_0x498331);
//     return crypto.subtle.importKey("raw", _0x1ed8a8, {
//         "name": "HMAC",
//         "hash": "SHA-256"
//     }, false, ["sign"]).then(function (_0x9854ac) {
//         return crypto.subtle.sign("HMAC", _0x9854ac, _0x46371c);
//     }).then(function (_0x110416) {
//         return new Uint8Array(_0x110416);
//     });
// }
// const avsDeriveSegKey = (_0x287dc6, _0x2af81e, _0x4cddaf) => {
//     var _0x4c5902 = "string" == typeof _0x287dc6 ? _0x4d5e34(_0x287dc6) : _0x287dc6;
//     return _0x4c5902 && 32 === _0x4c5902.length ? _0x52121c(_0x4c5902, "seg:" + _0x2af81e + ":" + _0x4cddaf).then(function (_0x4c49bd) {
//         return _0x4c49bd.slice(0, 16);
//     }) : Promise.reject(new Error("_avsDeriveSegKey: sk must be 32 bytes"));
// };
// const avsDeriveSegIv = (_0xf5aa4e, _0x5f504d, _0x4a33d9) => {
//     var _0x29b76c = "string" == typeof _0xf5aa4e ? _0x4d5e34(_0xf5aa4e) : _0xf5aa4e;
//     return _0x29b76c && 32 === _0x29b76c.length ? _0x52121c(_0x29b76c, "iv:" + _0x5f504d + ":" + _0x4a33d9).then(function (_0x5d347e) {
//         console.log(_0x5d347e.slice(0, 16))
//         return _0x5d347e.slice(0, 16);
//     }) : Promise.reject(new Error("_avsDeriveSegIv: sk must be 32 bytes"));
// };
// var iv = await avsDeriveSegIv(_0x33d36d, segmentId, dt)
// var segkey = await avsDeriveSegKey(_0x33d36d, segmentId, dt)
// console.log('iv : ', iv)
// console.log('segkey : ', segkey)
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
const fectseg = async () => {
    const API_URL = "https://lh3.googleusercontent.com/0PKLrgRoGS2M-7JjzVuxSEMrBoV9o-sehavFWvN6X5pSB69lzQ60JA_-rQVcPxn3jggVhF1ho5DtvLP059d-zEmpJvSso3XKtSSFpfVnPLM6gh4D_gggF1MkoZ810Q=d"
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
        return response.data
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
    const segdata = await fectseg();
    console.log(SliceData(segdata))
}
export default run