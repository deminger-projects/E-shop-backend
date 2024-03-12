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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const modify_images_1 = __importDefault(require("../modify_images"));
function save_files(path, files) {
    return __awaiter(this, void 0, void 0, function* () {
        fs.mkdir(path, (err) => {
            if (err) {
                console.log("🚀 ~ file: save_files.ts:8 ~ fs.mkdir ~ err:", err.message);
            }
            else {
                var multiple_files = files.multiple_files;
                var single_file = files.single_file;
                if (multiple_files) {
                    for (let index = 0; index < multiple_files.length; index++) {
                        multiple_files[index].mv(path + "/" + multiple_files[index].name, (err) => {
                            if (err) {
                                console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message);
                            }
                            else {
                                (0, modify_images_1.default)(undefined, path);
                            }
                        });
                    }
                }
                else if (single_file) {
                    single_file.mv(path + "/" + single_file.name, (err) => {
                        if (err) {
                            console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message);
                        }
                        else {
                            (0, modify_images_1.default)(single_file, path);
                        }
                    });
                }
            }
        });
    });
}
exports.default = save_files;
