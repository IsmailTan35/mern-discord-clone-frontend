var controllerAuth = require('./controllerAuth')
var controllerDevices = require('./controllerDevices')
var controllerDrivers = require('./controllerDrivers')
var controllerGeofence = require('./controllerGeofence')
var controllerGroup = require('./controllerGroup')
var controllerMaintenances = require('./controllerMaintenances')
var controllerSocket = require('./controllerSocket')
var verifyToken = require("../helper/helperVerify")

module.exports = function(app,con){
    
    app.db = con;
    app.post('/api/auth/login', controllerAuth.loginPost)
    app.post('/api/auth/logout',verifyToken.verify, controllerAuth.logoutPost)
    app.post('/api/devices',verifyToken.verify, controllerDevices.devicesPost)
    app.post('/api/drivers',verifyToken.verify, controllerDrivers.driversPost)
    app.post('/api/geofences',verifyToken.verify, controllerGeofence.geofencePost)
    app.post('/api/devices',verifyToken.verify, controllerGroup.groupPost)
    app.post('/api/maintenances',verifyToken.verify, controllerMaintenances.maintenancesPost)
    app.post('/api/socket',verifyToken.verify, controllerSocket.socketPost)
}