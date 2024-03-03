"use strict";
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
const write_json_1 = __importDefault(require("../write_json"));
function get_collections() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([(0, write_json_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
                "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"], "../client/src/data/new_collections.json")]);
    });
}
exports.default = get_collections;
