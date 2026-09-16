using MongoDB.Driver;
using HealthCarePlus.API.Models;
using BCrypt.Net;

namespace HealthCarePlus.API.Services;

public class SeedDataService
{
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Patient> _patients;
    private readonly IMongoCollection<Doctor> _doctors;
    private readonly IMongoCollection<Pharmacy> _pharmacies;
    private readonly IMongoCollection<DrugDatabase> _drugs;
    private readonly IMongoCollection<Prescription> _prescriptions;

    public SeedDataService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
        _patients = database.GetCollection<Patient>("patients");
        _doctors = database.GetCollection<Doctor>("doctors");
        _pharmacies = database.GetCollection<Pharmacy>("pharmacies");
        _drugs = database.GetCollection<DrugDatabase>("drugs");
        _prescriptions = database.GetCollection<Prescription>("prescriptions");
    }

    public async Task SeedDataAsync()
    {
        Console.WriteLine();
        Console.WriteLine("======================================================");
        Console.WriteLine("🌱 Starting MongoDB database seeding...");
        Console.WriteLine("======================================================");

        // ======================================================
        // Check Existing Data
        // ======================================================

        var userCount = await _users.CountDocumentsAsync(_ => true);
        var patientCount = await _patients.CountDocumentsAsync(_ => true);
        var doctorCount = await _doctors.CountDocumentsAsync(_ => true);
        var pharmacyCount = await _pharmacies.CountDocumentsAsync(_ => true);
        var drugCount = await _drugs.CountDocumentsAsync(_ => true);
        var prescriptionCount =
            await _prescriptions.CountDocumentsAsync(_ => true);

        Console.WriteLine();
        Console.WriteLine("📊 Existing MongoDB documents:");
        Console.WriteLine($"   Users         : {userCount}");
        Console.WriteLine($"   Patients      : {patientCount}");
        Console.WriteLine($"   Doctors       : {doctorCount}");
        Console.WriteLine($"   Pharmacies    : {pharmacyCount}");
        Console.WriteLine($"   Drugs         : {drugCount}");
        Console.WriteLine($"   Prescriptions : {prescriptionCount}");

        // ======================================================
        // Skip Seeding If Any Data Already Exists
        // ======================================================

        if (
            userCount > 0 ||
            patientCount > 0 ||
            doctorCount > 0 ||
            pharmacyCount > 0 ||
            drugCount > 0 ||
            prescriptionCount > 0
        )
        {
            Console.WriteLine();
            Console.WriteLine("ℹ️ MongoDB already contains data.");
            Console.WriteLine("⏭️ Skipping database seeding.");
            Console.WriteLine();

            return;
        }

        Console.WriteLine();
        Console.WriteLine("📦 MongoDB collections are empty.");
        Console.WriteLine("🌱 Creating sample data...");
        Console.WriteLine();

        // ======================================================
        // 1. Create Sample Users
        // ======================================================

        var now = DateTime.UtcNow;

        var patientUser = new User
        {
            Username = "patient1",
            Email = "patient1@healthcare.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "Patient",
            FirstName = "John",
            LastName = "Doe",
            Phone = "+1234567890",
            DateOfBirth = new DateTime(1990, 1, 1),
            CreatedAt = now,
            UpdatedAt = now
        };

        var doctorUser = new User
        {
            Username = "doctor1",
            Email = "doctor1@healthcare.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "Doctor",
            FirstName = "Dr. Jane",
            LastName = "Smith",
            Phone = "+1234567891",
            LicenseNumber = "MD123456",
            CreatedAt = now,
            UpdatedAt = now
        };

        var pharmacistUser = new User
        {
            Username = "pharmacist1",
            Email = "pharmacist1@healthcare.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "Pharmacist",
            FirstName = "Mike",
            LastName = "Johnson",
            Phone = "+1234567892",
            CreatedAt = now,
            UpdatedAt = now
        };

        // ======================================================
        // Insert Users
        // ======================================================

        await _users.InsertManyAsync(
            new[]
            {
                patientUser,
                doctorUser,
                pharmacistUser
            }
        );

        Console.WriteLine("✅ 3 users created.");

        // ======================================================
        // 2. Create Patient
        // ======================================================

        var patient = new Patient
        {
            UserId = patientUser.Id,

            MedicalRecordNumber = "MRN001",

            BloodType = "A+",

            Allergies = new List<string>
            {
                "Penicillin",
                "Shellfish"
            },

            ChronicConditions = new List<string>
            {
                "Hypertension"
            },

            EmergencyContact = new EmergencyContact
            {
                Name = "Jane Doe",
                Phone = "+1234567899",
                Relationship = "Spouse"
            },

            InsuranceInfo = new InsuranceInfo
            {
                Provider = "HealthPlus Insurance",
                PolicyNumber = "HP123456",
                GroupNumber = "GRP001"
            },

            CreatedAt = now,
            UpdatedAt = now
        };

        await _patients.InsertOneAsync(patient);

        Console.WriteLine("✅ Patient record created.");

        // ======================================================
        // 3. Create Doctor
        // ======================================================

        var doctor = new Doctor
        {
            UserId = doctorUser.Id,

            LicenseNumber = "MD123456",

            Specialization = "Internal Medicine",

            MedicalSchool = "Harvard Medical School",

            YearsOfExperience = 10,

            Certifications = new List<string>
            {
                "Board Certified Internal Medicine"
            },

            Languages = new List<string>
            {
                "English",
                "Spanish"
            },

            Biography =
                "Experienced internal medicine physician with 10 years of practice.",

            ConsultationFee = 150.00m,

            IsAvailable = true,

            CreatedAt = now,
            UpdatedAt = now
        };

        await _doctors.InsertOneAsync(doctor);

        Console.WriteLine("✅ Doctor record created.");

        // ======================================================
        // 4. Create Pharmacy
        // ======================================================

        var pharmacy = new Pharmacy
        {
            UserId = pharmacistUser.Id,

            PharmacyName = "HealthPlus Pharmacy",

            LicenseNumber = "RX789012",

            Address = "123 Main St",

            City = "Anytown",

            State = "CA",

            ZipCode = "12345",

            Phone = "+1234567892",

            Email = "pharmacist1@healthcare.com",

            OperatingHours = new List<string>
            {
                "Monday: 8:00 AM - 8:00 PM",
                "Tuesday: 8:00 AM - 8:00 PM",
                "Wednesday: 8:00 AM - 8:00 PM",
                "Thursday: 8:00 AM - 8:00 PM",
                "Friday: 8:00 AM - 8:00 PM",
                "Saturday: 9:00 AM - 6:00 PM",
                "Sunday: 10:00 AM - 4:00 PM"
            },

            Services = new List<string>
            {
                "Prescription Filling",
                "Medication Consultation",
                "Delivery Service"
            },

            DeliveryFee = 5.00m,

            OffersDelivery = true,

            IsActive = true,

            CreatedAt = now,
            UpdatedAt = now
        };

        await _pharmacies.InsertOneAsync(pharmacy);

        Console.WriteLine("✅ Pharmacy record created.");

        // ======================================================
        // 5. Create Drug Database
        // ======================================================

        var drugs = new List<DrugDatabase>
        {
            // --------------------------------------------------
            // Lisinopril
            // --------------------------------------------------

            new DrugDatabase
            {
                DrugName = "Lisinopril",

                GenericName = "Lisinopril",

                BrandNames = new List<string>
                {
                    "Prinivil",
                    "Zestril"
                },

                Category = "ACE Inhibitor",

                Indications = new List<string>
                {
                    "Hypertension",
                    "Heart failure"
                },

                SideEffects = new List<string>
                {
                    "Dizziness",
                    "Dry cough",
                    "Elevated potassium levels"
                },

                Contraindications = new List<string>
                {
                    "Pregnancy",
                    "History of angioedema"
                },

                DosageForms = new List<string>
                {
                    "Tablet"
                },

                Strengths = new List<string>
                {
                    "5mg",
                    "10mg",
                    "20mg",
                    "40mg"
                },

                Interactions = new List<DrugInteraction>(),

                CreatedAt = now,
                UpdatedAt = now
            },

            // --------------------------------------------------
            // Metformin
            // --------------------------------------------------

            new DrugDatabase
            {
                DrugName = "Metformin",

                GenericName = "Metformin",

                BrandNames = new List<string>
                {
                    "Glucophage"
                },

                Category = "Biguanide",

                Indications = new List<string>
                {
                    "Type 2 diabetes"
                },

                SideEffects = new List<string>
                {
                    "Nausea",
                    "Diarrhea",
                    "Stomach upset",
                    "Metallic taste"
                },

                Contraindications = new List<string>
                {
                    "Kidney disease",
                    "Liver disease",
                    "Alcoholism"
                },

                DosageForms = new List<string>
                {
                    "Tablet"
                },

                Strengths = new List<string>
                {
                    "500mg",
                    "850mg",
                    "1000mg"
                },

                Interactions = new List<DrugInteraction>(),

                CreatedAt = now,
                UpdatedAt = now
            },

            // --------------------------------------------------
            // Amoxicillin
            // --------------------------------------------------

            new DrugDatabase
            {
                DrugName = "Amoxicillin",

                GenericName = "Amoxicillin",

                BrandNames = new List<string>
                {
                    "Amoxil"
                },

                Category = "Penicillin Antibiotic",

                Indications = new List<string>
                {
                    "Bacterial infections"
                },

                SideEffects = new List<string>
                {
                    "Nausea",
                    "Vomiting",
                    "Diarrhea",
                    "Skin rash"
                },

                Contraindications = new List<string>
                {
                    "Penicillin allergy"
                },

                DosageForms = new List<string>
                {
                    "Capsule"
                },

                Strengths = new List<string>
                {
                    "250mg",
                    "500mg",
                    "875mg"
                },

                Interactions = new List<DrugInteraction>(),

                CreatedAt = now,
                UpdatedAt = now
            }
        };

        // ======================================================
        // Insert Drugs
        // ======================================================

        await _drugs.InsertManyAsync(drugs);

        Console.WriteLine(
            $"✅ {drugs.Count} drug records created."
        );

        // ======================================================
        // 6. Create Sample Prescription
        // ======================================================

        var prescription = new Prescription
        {
            PrescriptionNumber =
                $"RX-{DateTime.UtcNow:yyyyMMdd}-SAMPLE01",

            DoctorId = doctorUser.Id,

            PatientId = patient.Id,

            Medications = new List<Medication>
            {
                new Medication
                {
                    DrugId = drugs[0].Id,

                    DrugName = "Lisinopril",

                    Dosage = "10mg",

                    Frequency = "Once daily",

                    Duration = "30 days",

                    Quantity = 30,

                    RefillsAllowed = 2,

                    Instructions =
                        "Take in the morning with or without food"
                }
            },

            Diagnosis = "Hypertension",

            Status = "Approved",

            DigitalSignature =
                $"SIGNED-{doctorUser.Id}-{DateTime.UtcNow:yyyyMMddHHmmss}",

            ExpiryDate =
                DateTime.UtcNow.AddMonths(6),

            Notes =
                "Monitor blood pressure regularly",

            CreatedAt = now,
            UpdatedAt = now
        };

        await _prescriptions.InsertOneAsync(prescription);

        Console.WriteLine(
            "✅ Sample prescription created."
        );

        // ======================================================
        // Seed Completed
        // ======================================================

        Console.WriteLine();
        Console.WriteLine("======================================================");
        Console.WriteLine("🎉 MongoDB sample data seeded successfully!");
        Console.WriteLine("======================================================");

        Console.WriteLine();
        Console.WriteLine("👤 Test Users");
        Console.WriteLine("----------------------------------------");

        Console.WriteLine(
            "Patient    : patient1 / password123"
        );

        Console.WriteLine(
            "Doctor     : doctor1 / password123"
        );

        Console.WriteLine(
            "Pharmacist : pharmacist1 / password123"
        );

        Console.WriteLine();
        Console.WriteLine("📦 MongoDB Collections");
        Console.WriteLine("----------------------------------------");

        Console.WriteLine("users");
        Console.WriteLine("patients");
        Console.WriteLine("doctors");
        Console.WriteLine("pharmacies");
        Console.WriteLine("drugs");
        Console.WriteLine("prescriptions");

        Console.WriteLine();
        Console.WriteLine("======================================================");
    }
}