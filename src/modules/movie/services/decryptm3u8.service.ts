import * as crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
@Injectable()
export class DecryptService {
    _0xc8ecf2(_0x538cb7) {
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
 _0x27da8e(_0x2e430a, _0x274443, _0x437fd4) {
    var _0x53a89c = _0x2e430a instanceof Uint8Array ? _0x2e430a : new Uint8Array(_0x2e430a);
    var _0x3ff44b = _0x53a89c.length;
    var _0x5d849f = new Uint8Array(_0x3ff44b);
    if (0 === _0x3ff44b) {
        return _0x5d849f.buffer;
    }
    var _0x144c3f = this._0xc8ecf2(_0x274443 + "|" + _0x437fd4);
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
_0x45ff42(_0x5f4670) {
    let _0x5841db : any = null
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
_0x2df12e(_0x287faa) {
    var _0x479eee = _0x287faa.replace(/-/g, "+").replace(/_/g, "/");
    _0x479eee += "==".slice(0, (4 - _0x479eee.length % 4) % 4);
    var _0x497f1f = atob(_0x479eee);
    var _0x2109cb = new Uint8Array(_0x497f1f.length);
    for (var _0x2a39fb = 0; _0x2a39fb < _0x497f1f.length; _0x2a39fb++) {
        _0x2109cb[_0x2a39fb] = _0x497f1f.charCodeAt(_0x2a39fb);
    }
    return _0x2109cb;
}
async _0x12dd0e(_0x2f71a3, _0x28a99b, _0x3d57b5, _0x174697, _0x37765c) {
    var _0x50e520 = {
        name: "HMAC",
        hash: "SHA-256"
    };
    var _0x4d6e3a;
    var _0x1d9033 = this._0x2df12e(_0x28a99b);
    var _0x157cf8 = await crypto.subtle.importKey("raw", _0x1d9033, _0x50e520, false, ["sign"]);
    var _0x111a49 = true
    var _0x9f4c99 = true
    var _0x10ac24 = 0
    var _0x5cbc09 = _0x111a49 && !_0x9f4c99 ? _0x10ac24 : 0;
    if (_0x111a49) {
        _0x4d6e3a = new TextEncoder().encode(_0x174697 + ":" + _0x37765c + ":" + _0x3d57b5 + ":" + _0x5cbc09);
    } else {
        _0x4d6e3a = new TextEncoder().encode(_0x174697 + ":" + _0x37765c + ":" + _0x3d57b5);
    }
    var _0x33bf90 = await crypto.subtle.sign("HMAC", _0x157cf8, _0x4d6e3a);
    var keys = {
        "enable": true,
        "permKey": _0x3d57b5,
        "permSalt": String(_0x37765c)
    }
    var _0x32cf1e = await crypto.subtle.importKey("raw", _0x33bf90, {
        "name": "AES-GCM"
    }, false, ["decrypt"]);
    var _0x101b87 = _0x1d9033.slice(0, 12);
    var _0x3fcb59 = this._0x2df12e(_0x2f71a3);
    var _0x5df9d5 = await crypto.subtle.decrypt({
        "name": "AES-GCM",
        "iv": _0x101b87
    }, _0x32cf1e, _0x3fcb59);
    var _0x5df9d5 = this._0x27da8e(_0x5df9d5, keys.permKey, keys.permSalt)
    return new TextDecoder().decode(_0x5df9d5);
}
_0x3bceb5(_0xa0fd4, _0x20d139) {
    try {
        var _0x2dec78 = _0xa0fd4.split('');
        var _0x2e01dd = _0x2dec78.length;
        var _0x418629 = parseInt(_0x20d139.substring(0, 8), 16) >>> 0;
        var _0x56aa23: any = [];
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
 _0x162254(_0x1a6d8a) {
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
    if ((_0x4d59aa[7 + _0x5b6338] << 24 | _0x4d59aa[7 + _0x5b6338 + 1] << 16 | _0x4d59aa[7 + _0x5b6338 + 2] << 8 | _0x4d59aa[7 + _0x5b6338 + 3]) >>> 0 !== this._0x45ff42(_0x35bfa8)) {
        throw new Error("CRC mismatch");
    }
    var _0x4e6df9 = '';
    for (var _0x3295b8 = 0; _0x3295b8 < _0x35bfa8.length; _0x3295b8++) {
        _0x4e6df9 += String.fromCharCode(_0x35bfa8[_0x3295b8]);
    }
    _0x4e6df9 = decodeURIComponent(escape(_0x4e6df9));
    return JSON.parse(_0x4e6df9);
}
async _0x1cf828(_0x543a5d, headers) {
    var _0x1cc54a;
    var _0x593e14;
    var _0x1a2584;
    var _0x4dcea4;
    var _0x1c2125 = _0x543a5d;
    var _0x226538 = headers["x-envelop"]
    var _0x1719c9: any = null;
    if (_0x226538) {
        try {
            _0x1719c9 = this._0x162254(_0x226538);
        } catch (_0x2e05d5) {
            console.log(_0x2e05d5)
        }
    }
    if (_0x1719c9) {
        _0x1cc54a = _0x1719c9.cn!;
        _0x593e14 = _0x1719c9.sk;
        _0x1a2584 = _0x1719c9.ts || "0";
        _0x4dcea4 = _0x1719c9.uid || "anon";
    } else {
        _0x1cc54a = headers["x-edge-tag"] || ""
        _0x593e14 = headers["x-cache-node"] || ""
        _0x1a2584 = headers["x-request-trace"] || "0"
        _0x4dcea4 = decodeURIComponent((headers["x-proxy-digest"] || '') || "anon");
    }
    var _0x2a9ffb: any = [];
    var _0x3de6e8: any = [];
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
    _0x20cca0.forEach(function (_0x1f4f68: any) {
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
    const result = await this._0x12dd0e(_0x324200 = this._0x3bceb5(_0x324200, _0x593e14), _0x1cc54a, _0x593e14, _0x4dcea4, _0x1a2584)
    return _0x543a5d = _0x3de6e8.join("\n") + "\n" + result;
}
}