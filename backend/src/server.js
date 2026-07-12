
const express=require('express')
const connection=require('./database')
const path=require('path')
const fs=require('fs')
const { fileURLToPath } = require('url');
const {login}=require('./controller/authController');
const {requireAuth}=require('./middleware/authMiddleware');
const Router=require('./routes/routes');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(process.cwd(), 'data-store.json');

app.use(express.json());





// RESTful API Endpoints

// 1. Authentication
app.post('/api',Router);

// Auth Middleware


app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// 2. Vehicle Registry CRUD
app.get('/api/vehicles', requireAuth, (req, res) => {
  const db = loadDB();
  let vehiclesList = db.vehicles;
  
  const { type, status, region, search } = req.query;
  if (type) vehiclesList = vehiclesList.filter(v => v.type === type);
  if (status) vehiclesList = vehiclesList.filter(v => v.status === status);
  if (region) vehiclesList = vehiclesList.filter(v => v.region === region);
  if (search) {
    const q = search.toLowerCase();
    vehiclesList = vehiclesList.filter(v => 
      v.registrationNumber.toLowerCase().includes(q) || 
      v.name.toLowerCase().includes(q)
    );
  }
  
  res.json(vehiclesList);
});

app.post('/api/vehicles', requireAuth, (req, res) => {
  const db = loadDB();
  const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, status, region } = req.body;
  
  if (!registrationNumber || !name || !type || !maxLoadCapacity || acquisitionCost === undefined) {
    return res.status(400).json({ error: 'All primary fields are required' });
  }
  
  const exists = db.vehicles.some(v => v.registrationNumber.toLowerCase() === registrationNumber.trim().toLowerCase());
  if (exists) {
    return res.status(400).json({ error: `Vehicle with Registration Number '${registrationNumber}' already exists.` });
  }
  
  const newVehicle = {
    id: registrationNumber.toUpperCase(),
    registrationNumber: registrationNumber.toUpperCase(),
    name,
    type,
    maxLoadCapacity: Number(maxLoadCapacity),
    odometer: Number(odometer || 0),
    acquisitionCost: Number(acquisitionCost),
    status: status || 'Available',
    region: region || 'Unassigned'
  };
  
  db.vehicles.push(newVehicle);
  saveDB(db);
  res.status(201).json(newVehicle);
});

app.put('/api/vehicles/:id', requireAuth, (req, res) => {
  const db = loadDB();
  const vehicleId = req.params.id;
  const vehicleIndex = db.vehicles.findIndex(v => v.id === vehicleId);
  
  if (vehicleIndex === -1) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  
  const currentVehicle = db.vehicles[vehicleIndex];
  const { name, type, maxLoadCapacity, odometer, acquisitionCost, status, region } = req.body;
  
  db.vehicles[vehicleIndex] = {
    ...currentVehicle,
    name: name || currentVehicle.name,
    type: type || currentVehicle.type,
    maxLoadCapacity: maxLoadCapacity !== undefined ? Number(maxLoadCapacity) : currentVehicle.maxLoadCapacity,
    odometer: odometer !== undefined ? Number(odometer) : currentVehicle.odometer,
    acquisitionCost: acquisitionCost !== undefined ? Number(acquisitionCost) : currentVehicle.acquisitionCost,
    status: status || currentVehicle.status,
    region: region || currentVehicle.region
  };
  
  saveDB(db);
  res.json(db.vehicles[vehicleIndex]);
});

app.delete('/api/vehicles/:id', requireAuth, (req, res) => {
  const db = loadDB();
  const vehicleId = req.params.id;
  const exists = db.vehicles.some(v => v.id === vehicleId);
  
  if (!exists) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  if (vehicle.status === 'On Trip') {
    return res.status(400).json({ error: 'Cannot delete a vehicle currently on an active trip.' });
  }
  
  db.vehicles = db.vehicles.filter(v => v.id !== vehicleId);
  saveDB(db);
  res.json({ message: 'Vehicle deleted successfully' });
});

// 3. Driver Management CRUD
app.get('/api/drivers', requireAuth, (req, res) => {
  const db = loadDB();
  res.json(db.drivers);
});

app.post('/api/drivers', requireAuth, (req, res) => {
  const db = loadDB();
  const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;
  
  if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
    return res.status(400).json({ error: 'Name, License Details, Contact Number are mandatory' });
  }
  
  const exists = db.drivers.some(d => d.licenseNumber.toLowerCase() === licenseNumber.trim().toLowerCase());
  if (exists) {
    return res.status(400).json({ error: `Driver with License Number '${licenseNumber}' already exists.` });
  }
  
  const newDriver = {
    id: `d-${Date.now()}`,
    name,
    licenseNumber,
    licenseCategory,
    licenseExpiryDate,
    contactNumber,
    safetyScore: Number(safetyScore || 100),
    status: status || 'Available'
  };
  
  db.drivers.push(newDriver);
  saveDB(db);
  res.status(201).json(newDriver);
});

app.put('/api/drivers/:id', requireAuth, (req, res) => {
  const db = loadDB();
  const driverId = req.params.id;
  const idx = db.drivers.findIndex(d => d.id === driverId);
  
  if (idx === -1) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  
  const currentDriver = db.drivers[idx];
  const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;
  
  db.drivers[idx] = {
    ...currentDriver,
    name: name || currentDriver.name,
    licenseNumber: licenseNumber || currentDriver.licenseNumber,
    licenseCategory: licenseCategory || currentDriver.licenseCategory,
    licenseExpiryDate: licenseExpiryDate || currentDriver.licenseExpiryDate,
    contactNumber: contactNumber || currentDriver.contactNumber,
    safetyScore: safetyScore !== undefined ? Number(safetyScore) : currentDriver.safetyScore,
    status: status || currentDriver.status
  };
  
  saveDB(db);
  res.json(db.drivers[idx]);
});

app.delete('/api/drivers/:id', requireAuth, (req, res) => {
  const db = loadDB();
  const driverId = req.params.id;
  const driver = db.drivers.find(d => d.id === driverId);
  
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  
  if (driver.status === 'On Trip') {
    return res.status(400).json({ error: 'Cannot delete a driver currently on a trip.' });
  }
  
  db.drivers = db.drivers.filter(d => d.id !== driverId);
  saveDB(db);
  res.json({ message: 'Driver deleted successfully' });
});

// 4. Trip Management API
app.get('/api/trips', requireAuth, (req, res) => {
  const db = loadDB();
  res.json(db.trips);
});

app.post('/api/trips', requireAuth, (req, res) => {
  const db = loadDB();
  const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance, revenue, date } = req.body;
  
  if (!source || !destination || !vehicleId || !driverId || cargoWeight === undefined || plannedDistance === undefined || revenue === undefined) {
    return res.status(400).json({ error: 'Missing required trip fields' });
  }
  
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  const driver = db.drivers.find(d => d.id === driverId);
  
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  
  if (vehicle.status === 'Retired' || vehicle.status === 'In Shop') {
    return res.status(400).json({ error: `Vehicle '${vehicleId}' is currently ${vehicle.status} and cannot be assigned to trips.` });
  }
  
  const isExpired = new Date(driver.licenseExpiryDate) < new Date();
  if (isExpired) {
    return res.status(400).json({ error: `Driver '${driver.name}' has an expired license (Expiry: ${driver.licenseExpiryDate}).` });
  }
  if (driver.status === 'Suspended') {
    return res.status(400).json({ error: `Driver '${driver.name}' is Suspended and cannot be assigned to trips.` });
  }
  
  if (vehicle.status === 'On Trip') {
    return res.status(400).json({ error: `Vehicle '${vehicleId}' is currently On Trip.` });
  }
  if (driver.status === 'On Trip') {
    return res.status(400).json({ error: `Driver '${driver.name}' is currently On Trip.` });
  }
  
  if (Number(cargoWeight) > vehicle.maxLoadCapacity) {
    return res.status(400).json({ error: `Cargo weight (${cargoWeight} kg) exceeds vehicle maximum capacity (${vehicle.maxLoadCapacity} kg).` });
  }
  
  const newTrip = {
    id: `t-${Date.now()}`,
    source,
    destination,
    vehicleId,
    driverId,
    cargoWeight: Number(cargoWeight),
    plannedDistance: Number(plannedDistance),
    status: 'Draft',
    revenue: Number(revenue),
    date: date || new Date().toISOString().split('T')[0]
  };
  
  db.trips.push(newTrip);
  saveDB(db);
  res.status(201).json(newTrip);
});

// Trip Transition Actions
app.put('/api/trips/:id/status', requireAuth, (req, res) => {
  const db = loadDB();
  const tripId = req.params.id;
  const { status, odometerAtEnd, fuelConsumed } = req.body;
  
  const tripIdx = db.trips.findIndex(t => t.id === tripId);
  if (tripIdx === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  
  const trip = db.trips[tripIdx];
  const oldStatus = trip.status;
  
  if (oldStatus === status) {
    return res.json(trip);
  }
  
  const vehicle = db.vehicles.find(v => v.id === trip.vehicleId);
  const driver = db.drivers.find(d => d.id === trip.driverId);
  
  if (status === 'Dispatched') {
    if (oldStatus !== 'Draft') {
      return res.status(400).json({ error: 'Can only dispatch a trip in Draft status.' });
    }
    if (vehicle.status === 'On Trip' || driver.status === 'On Trip') {
      return res.status(400).json({ error: 'Vehicle or Driver is already assigned to another active trip.' });
    }
    
    vehicle.status = 'On Trip';
    driver.status = 'On Trip';
    trip.status = 'Dispatched';
    trip.odometerAtStart = vehicle.odometer;
  } 
  else if (status === 'Completed') {
    if (oldStatus !== 'Dispatched') {
      return res.status(400).json({ error: 'Can only complete a trip that is currently Dispatched.' });
    }
    if (odometerAtEnd === undefined || odometerAtEnd < vehicle.odometer) {
      return res.status(400).json({ error: `Final odometer must be provided and be >= starting odometer (${vehicle.odometer} km).` });
    }
    
    trip.status = 'Completed';
    trip.odometerAtEnd = Number(odometerAtEnd);
    trip.fuelConsumed = Number(fuelConsumed || 0);
    vehicle.odometer = Number(odometerAtEnd);
    vehicle.status = 'Available';
    driver.status = 'Available';
    
    if (fuelConsumed && Number(fuelConsumed) > 0) {
      const fuelCost = Number(fuelConsumed) * 4.5;
      const fuelLogId = `f-${Date.now()}`;
      db.fuelLogs.push({
        id: fuelLogId,
        vehicleId: vehicle.id,
        liters: Number(fuelConsumed),
        cost: fuelCost,
        date: new Date().toISOString().split('T')[0]
      });
      db.expenses.push({
        id: `e-${Date.now()}-fuel`,
        vehicleId: vehicle.id,
        type: 'other',
        amount: fuelCost,
        date: new Date().toISOString().split('T')[0],
        description: `Fuel Expense for completed Trip ${tripId} (${fuelConsumed} Liters)`
      });
    }
  } 
  else if (status === 'Cancelled') {
    if (oldStatus === 'Dispatched') {
      vehicle.status = 'Available';
      driver.status = 'Available';
    }
    trip.status = 'Cancelled';
  } else {
    return res.status(400).json({ error: 'Invalid trip status transition.' });
  }
  
  saveDB(db);
  res.json(trip);
});

// 5. Maintenance API
app.get('/api/maintenance', requireAuth, (req, res) => {
  const db = loadDB();
  res.json(db.maintenanceLogs);
});

app.post('/api/maintenance', requireAuth, (req, res) => {
  const db = loadDB();
  const { vehicleId, description, cost, startDate } = req.body;
  
  if (!vehicleId || !description || cost === undefined) {
    return res.status(400).json({ error: 'Vehicle ID, description and cost are required' });
  }
  
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  if (vehicle.status === 'On Trip') {
    return res.status(400).json({ error: 'Cannot send a vehicle to maintenance while it is on a trip.' });
  }
  
  vehicle.status = 'In Shop';
  
  const newLog = {
    id: `m-${Date.now()}`,
    vehicleId,
    description,
    cost: Number(cost),
    startDate: startDate || new Date().toISOString().split('T')[0],
    status: 'Active'
  };
  
  db.maintenanceLogs.push(newLog);
  db.expenses.push({
    id: `e-${Date.now()}-maint`,
    vehicleId,
    type: 'maintenance',
    amount: Number(cost),
    date: startDate || new Date().toISOString().split('T')[0],
    description: `Maintenance: ${description}`
  });
  
  saveDB(db);
  res.status(201).json(newLog);
});

app.put('/api/maintenance/:id/close', requireAuth, (req, res) => {
  const db = loadDB();
  const logId = req.params.id;
  const { endDate } = req.body;
  
  const logIdx = db.maintenanceLogs.findIndex(m => m.id === logId);
  if (logIdx === -1) {
    return res.status(404).json({ error: 'Maintenance record not found' });
  }
  
  const log = db.maintenanceLogs[logIdx];
  if (log.status === 'Closed') {
    return res.status(400).json({ error: 'Maintenance log is already closed.' });
  }
  
  log.status = 'Closed';
  log.endDate = endDate || new Date().toISOString().split('T')[0];
  
  const vehicle = db.vehicles.find(v => v.id === log.vehicleId);
  if (vehicle && vehicle.status !== 'Retired') {
    vehicle.status = 'Available';
  }
  
  saveDB(db);
  res.json(log);
});

// 6. Fuel & Expense API
app.get('/api/fuel-logs', requireAuth, (req, res) => {
  const db = loadDB();
  res.json(db.fuelLogs);
});

app.post('/api/fuel-logs', requireAuth, (req, res) => {
  const db = loadDB();
  const { vehicleId, liters, cost, date } = req.body;
  
  if (!vehicleId || !liters || !cost) {
    return res.status(400).json({ error: 'Vehicle ID, liters and cost are required' });
  }
  
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  
  const newFuelLog = {
    id: `f-${Date.now()}`,
    vehicleId,
    liters: Number(liters),
    cost: Number(cost),
    date: date || new Date().toISOString().split('T')[0]
  };
  
  db.fuelLogs.push(newFuelLog);
  db.expenses.push({
    id: `e-${Date.now()}-fuel`,
    vehicleId,
    type: 'other',
    amount: Number(cost),
    date: date || new Date().toISOString().split('T')[0],
    description: `Fuel Fill: ${liters}L`
  });
  
  saveDB(db);
  res.status(201).json(newFuelLog);
});

app.get('/api/expenses', requireAuth, (req, res) => {
  const db = loadDB();
  res.json(db.expenses);
});

app.post('/api/expenses', requireAuth, (req, res) => {
  const db = loadDB();
  const { vehicleId, type, amount, date, description } = req.body;
  
  if (!vehicleId || !type || amount === undefined || !description) {
    return res.status(400).json({ error: 'Missing required expense fields' });
  }
  
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  
  const newExpense = {
    id: `e-${Date.now()}`,
    vehicleId,
    type,
    amount: Number(amount),
    date: date || new Date().toISOString().split('T')[0],
    description
  };
  
  db.expenses.push(newExpense);
  saveDB(db);
  res.status(201).json(newExpense);
});

// 7. Dashboard and Reports Metrics
app.get('/api/dashboard/kpis', requireAuth, (req, res) => {
  const db = loadDB();
  
  const activeVehicles = db.vehicles.filter(v => v.status === 'On Trip').length;
  const availableVehicles = db.vehicles.filter(v => v.status === 'Available').length;
  const vehiclesInMaintenance = db.vehicles.filter(v => v.status === 'In Shop').length;
  
  const activeTrips = db.trips.filter(t => t.status === 'Dispatched').length;
  const pendingTrips = db.trips.filter(t => t.status === 'Draft').length;
  const driversOnDuty = db.drivers.filter(d => d.status === 'On Trip' || d.status === 'Available').length;
  
  const operationalVehicles = db.vehicles.filter(v => v.status !== 'Retired').length;
  const nonAvailableCount = db.vehicles.filter(v => v.status === 'On Trip' || v.status === 'In Shop').length;
  const fleetUtilization = operationalVehicles > 0 
    ? Math.round((nonAvailableCount / operationalVehicles) * 100) 
    : 0;
    
  const kpis = {
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization
  };
  
  res.json(kpis);
});

app.get('/api/reports', requireAuth, (req, res) => {
  const db = loadDB();
  
  const reports = db.vehicles.map(v => {
    const completedTrips = db.trips.filter(t => t.vehicleId === v.id && t.status === 'Completed');
    const totalDistance = completedTrips.reduce((acc, t) => acc + (t.plannedDistance || 0), 0);
    const totalFuel = completedTrips.reduce((acc, t) => acc + (t.fuelConsumed || 0), 0);
    
    const maintenanceCosts = db.maintenanceLogs
      .filter(m => m.vehicleId === v.id)
      .reduce((acc, m) => acc + m.cost, 0);
      
    const fuelCosts = db.fuelLogs
      .filter(f => f.vehicleId === v.id)
      .reduce((acc, f) => acc + f.cost, 0);
      
    const tollsCosts = db.expenses
      .filter(e => e.vehicleId === v.id && e.type === 'toll')
      .reduce((acc, e) => acc + e.amount, 0);
      
    const otherCosts = db.expenses
      .filter(e => e.vehicleId === v.id && e.type === 'other' && !e.description.toLowerCase().includes('fuel'))
      .reduce((acc, e) => acc + e.amount, 0);
      
    const totalOperationalCost = maintenanceCosts + fuelCosts + tollsCosts + otherCosts;
    const totalRevenue = completedTrips.reduce((acc, t) => acc + t.revenue, 0);
    
    const roi = v.acquisitionCost > 0
      ? (totalRevenue - totalOperationalCost) / v.acquisitionCost
      : 0;
      
    return {
      vehicleId: v.id,
      vehicleName: v.name,
      totalDistance,
      totalFuel,
      fuelEfficiency: totalFuel > 0 ? Number((totalDistance / totalFuel).toFixed(2)) : 0,
      totalMaintenanceCost: maintenanceCosts,
      totalFuelCost: fuelCosts,
      totalTollCost: tollsCosts,
      totalOtherCost: otherCosts,
      totalOperationalCost,
      totalRevenue,
      roi: Number((roi * 100).toFixed(2))
    };
  });
  
  res.json(reports);
});
