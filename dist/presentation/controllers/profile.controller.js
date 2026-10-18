"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const api_response_1 = require("../../core/types/api-response");
class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    getProfile = async (req, res, next) => {
        try {
            const profile = await this.profileService.getProfile(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(profile, 'Profile retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const updated = await this.profileService.updateProfile(req.user.userId, req.body);
            res.status(200).json(api_response_1.ResponseFormatter.success(updated, 'Profile updated successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getAddresses = async (req, res, next) => {
        try {
            const addresses = await this.profileService.getAddresses(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(addresses, 'Addresses retrieved', { total: addresses.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    addAddress = async (req, res, next) => {
        try {
            const address = await this.profileService.addAddress(req.user.userId, req.body);
            res.status(201).json(api_response_1.ResponseFormatter.success(address, 'Address saved successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    deleteAddress = async (req, res, next) => {
        try {
            const id = req.params.id;
            await this.profileService.deleteAddress(req.user.userId, id);
            res.status(200).json(api_response_1.ResponseFormatter.success(null, 'Address deleted', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    setDefaultAddress = async (req, res, next) => {
        try {
            const id = req.params.id;
            const updated = await this.profileService.setDefaultAddress(req.user.userId, id);
            res.status(200).json(api_response_1.ResponseFormatter.success(updated, 'Default address updated', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getCards = async (req, res, next) => {
        try {
            const cards = await this.profileService.getCards(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(cards, 'Payment cards retrieved', { total: cards.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    addCard = async (req, res, next) => {
        try {
            const card = await this.profileService.addCard(req.user.userId, req.body);
            res.status(201).json(api_response_1.ResponseFormatter.success(card, 'Card saved successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    deleteCard = async (req, res, next) => {
        try {
            const id = req.params.id;
            await this.profileService.deleteCard(req.user.userId, id);
            res.status(200).json(api_response_1.ResponseFormatter.success(null, 'Card deleted', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getNotifications = async (req, res, next) => {
        try {
            const notifs = await this.profileService.getNotifications(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(notifs, 'Notifications retrieved', { total: notifs.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    markNotificationsRead = async (req, res, next) => {
        try {
            await this.profileService.markAllNotificationsRead(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(null, 'All notifications marked as read', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
}
exports.ProfileController = ProfileController;
