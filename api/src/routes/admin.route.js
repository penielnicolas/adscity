const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const adminController = require('../controllers/admin.controller');


// Actions Admin sur les utilisateurs
router.get('/users', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getUsers); // liste des utilisateurs
router.get('/users/:id', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getUserById); // détails d'un utilisateur
router.delete('/users/:id', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.deleteUser); // suppression d'un utilisateur
router.patch('/users/:id/role', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.updateUserRole); // mise à jour du rôle d'un utilisateur
router.patch('/users/:id/toggle-active', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.toggleUserActive); // activation/désactivation d'un utilisateur
router.get('/users/:id/login-stats', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getUserLoginStats); // statistiques de connexion d'un utilisateur
router.get('/users/country-stats', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getUsersCountries); // Statistiques des utilisateurs par pays
router.get('/users/city-stats', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getUsersCities); // Statistiques des utilisateurs par ville

// Actions Admin sur les annonces
router.get('/listings', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getListings); // liste des annonces
router.get('/listings/:id', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getListingById); // détails d'une annonce
router.delete('/listings/:id/delete', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.deleteListing); // suppression d'une annonce
router.patch('/listings/:id/toggle-active', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.toggleListingActive); // activation/désactivation d'une annonce
router.put('/listings/:id/approve', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.approveListing); // approbation d'une annonce
router.put('/listings/:id/reject', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.rejectListing); // rejet d'une annonce

// Actions Admins sur les Tickets de support
router.get('/tickets', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.listTickets);
router.patch('/tcket/:id', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.updateTicket);


// Actions Admins sur les rapports
router.get('/reports', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getReports);
router.get('/reports/:id', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.getReportById);
router.delete('/reports/:id', authenticate, requireRole("ADMIN", "SUPER_ADMIN", "MODERATOR"), adminController.deleteReport);


module.exports = router;