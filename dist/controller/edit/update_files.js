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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function update_files(file_names_to_keep, folder, record_id, callback, files) {
    var path = "../client/public/images/" + JSON.parse(folder) + "/" + record_id;
    fs.readdir(path, (err, data) => {
        if (err) {
            console.log("🚀 ~ file: update_files.ts:10 ~ fs.readdir ~ err:", err.message);
            return callback({ status: false, msg: "read directory failed" });
        }
        else {
            var files_to_delete = [];
            for (var saved_file_name of data) {
                var keep = false;
                for (var file_name_to_keep of file_names_to_keep) {
                    if (saved_file_name === file_name_to_keep) {
                        keep = true;
                        break;
                    }
                }
                if (keep === false) {
                    files_to_delete.push(saved_file_name);
                }
            }
            for (var file_name of files_to_delete) {
                fs.unlink(path + "/" + file_name, (err) => {
                    if (err) {
                        console.log("🚀 ~ file: update_files.ts:28 ~ fs.unlink ~ err:", err.message);
                        return callback({ status: false, msg: "removing file failed" });
                    }
                    else {
                        console.log("🚀 ~ file: update_files.ts:28 ~ fs.unlink ~ deleted file:", file_name);
                    }
                });
            }
            if (files) {
                var multiple_files = files.multiple_files;
                var single_file = files.single_file;
                if (multiple_files) {
                    for (let index = 0; index < multiple_files.length; index++) {
                        multiple_files[index].mv(path + "/" + multiple_files[index].name, (err) => {
                            if (err) {
                                console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message);
                            }
                            else {
                                console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ file saved:", multiple_files[index].name);
                            }
                        });
                    }
                    return callback({ status: true, msg: "multiple files updated" });
                }
                else if (single_file) {
                    single_file.mv(path + "/" + single_file.name, (err) => {
                        if (err) {
                            console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message);
                        }
                        else {
                            console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ file saved:", single_file.name);
                            return callback({ status: true, msg: "singe file updated" });
                        }
                    });
                }
            }
        }
    });
}
exports.default = update_files;
