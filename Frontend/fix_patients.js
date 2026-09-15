db = db.getSiblingDB('healthcareplus');

// Find all users without patient records
var usersWithoutPatients = [];
db.users.find({Role: 'Patient'}).forEach(function(user) {
    var patient = db.patients.findOne({UserId: user._id});
    if (!patient) {
        usersWithoutPatients.push(user);
    }
});

print('Users without patient records: ' + usersWithoutPatients.length);

// Create patient records for users missing them
usersWithoutPatients.forEach(function(user) {
    var mrn = 'MRN-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    var newPatient = {
        UserId: user._id,
        MedicalRecordNumber: mrn,
        BloodType: 'Unknown',
        Allergies: [],
        ChronicConditions: [],
        EmergencyContact: { Name: '', Phone: '', Relationship: '' },
        InsuranceInfo: { Provider: '', PolicyNumber: '', GroupNumber: '' },
        CreatedAt: new Date(),
        UpdatedAt: new Date()
    };
    db.patients.insertOne(newPatient);
    print('Created patient record for user: ' + user.Email + ' (MRN: ' + mrn + ')');
});

print('Done!');
