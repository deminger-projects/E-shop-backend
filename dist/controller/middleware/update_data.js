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
const update_admin_data_1 = __importDefault(require("../file_handlers/updates/update_admin_data"));
const update_user_data_1 = __importDefault(require("../file_handlers/updates/update_user_data"));
const update_not_user_data_1 = __importDefault(require("../file_handlers/updates/update_not_user_data"));
function update_data(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_1.default)();
        }
        next();
    });
}
exports.default = update_data;
