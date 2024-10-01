"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function save_files(path, files) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        var folder = "products";
        var redord_id = 151;
        if (!fs.existsSync("./public/")) {
            fs.mkdirSync("./public/");
        }
        if (!fs.existsSync("./public/images/")) {
            fs.mkdirSync("./public/images/");
        }
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        // if(!fs.existsSync("./image_storage/" + folder + "/")){
        //   fs.mkdirSync("/image_storage/" + folder + "/")
        // }
        // if(!fs.existsSync("./image_storage/" + folder + "/" + record_id + "/")){
        //   fs.mkdirSync("./image_storage/" + folder + "/" + record_id + "/")
        // }
        //fs.mkdirSync("./image_storage/" + "test/")
        if (!fs.existsSync("/image_storage/" + folder + "/")) { // funguje takze by melo stacit predelat cesty i react 
            fs.mkdirSync("/image_storage/" + folder + "/");
        }
        if (!fs.existsSync("/image_storage/" + folder + "/" + redord_id + "/")) { // funguje takze by melo stacit predelat cesty i react 
            fs.mkdirSync("/image_storage/" + folder + "/" + redord_id + "/");
        }
        var prom = [];
        var multiple_files = files.multiple_files;
        var single_file = files.single_file;
        if (multiple_files) {
            try {
                for (var _d = true, multiple_files_1 = __asyncValues(multiple_files), multiple_files_1_1; multiple_files_1_1 = yield multiple_files_1.next(), _a = multiple_files_1_1.done, !_a; _d = true) {
                    _c = multiple_files_1_1.value;
                    _d = false;
                    const file = _c;
                    prom.push(file.mv(path + file.name));
                    //var test_name = "products_" + file.name
                    yield file.mv("/image_storage/" + folder + "/" + redord_id + "/" + file.name);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = multiple_files_1.return)) yield _b.call(multiple_files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield Promise.all(prom);
        }
        else if (single_file) {
            prom.push(single_file.mv(path + single_file.name));
            //single_file.mv("/image_storage/" + single_file.name)
            yield Promise.all(prom);
        }
    });
}
exports.default = save_files;
