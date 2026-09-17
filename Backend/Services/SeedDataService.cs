using MongoDB.Driver;
using MediCore.API.Models;
using BCrypt.Net;

namespace MediCore.API.Services;

public class SeedDataService
{
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Patient> _patients;
    private readonly IMongoCollection<Doctor> _doctors;
    private readonly IMongoCollection<Pharmacy> _pharmacies;
    private readonly IMongoCollection<DrugDatabase> _drugs;
    private readonly IMongoCollection<Prescription> _prescriptions;
    private readonly IMongoCollection<Appointment> _appointments;

    public SeedDataService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
        _patients = database.GetCollection<Patient>("patients");
        _doctors = database.GetCollection<Doctor>("doctors");
        _pharmacies = database.GetCollection<Pharmacy>("pharmacies");
        _drugs = database.GetCollection<DrugDatabase>("drugs");
        _prescriptions = database.GetCollection<Prescription>("prescriptions");
        _appointments = database.GetCollection<Appointment>("appointments");
    }

    public async Task SeedDataAsync()
    {
        Console.WriteLine();
        Console.WriteLine("======================================================");
        Console.WriteLine("🌱 Starting MongoDB database seeding / verification...");
        Console.WriteLine("======================================================");

        var now = DateTime.UtcNow;

        // 1. Seed Admin User if not exists
        var adminUser = await _users.Find(u => u.Role == "Admin" || u.Username == "admin").FirstOrDefaultAsync();
        if (adminUser == null)
        {
            adminUser = new User
            {
                Username = "admin",
                Email = "admin@MediCore.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "Admin",
                FirstName = "System",
                LastName = "Administrator",
                Phone = "+1234567800",
                AvatarColor = "from-purple-500 to-indigo-600",
                AvatarEmoji = "🛡️",
                CreatedAt = now,
                UpdatedAt = now
            };
            await _users.InsertOneAsync(adminUser);
            Console.WriteLine("✅ Admin user seeded: admin / admin123");
        }

        // 2. Seed Patient User & Record if not exists
        var patientUser = await _users.Find(u => u.Username == "patient1").FirstOrDefaultAsync();
        if (patientUser == null)
        {
            patientUser = new User
            {
                Username = "patient1",
                Email = "patient1@healthcare.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = "Patient",
                FirstName = "John",
                LastName = "Doe",
                Phone = "+1 (555) 019-2834",
                DateOfBirth = new DateTime(1990, 1, 1),
                AvatarColor = "from-blue-500 to-indigo-600",
                AvatarEmoji = "🧑",
                CreatedAt = now,
                UpdatedAt = now
            };
            await _users.InsertOneAsync(patientUser);
            Console.WriteLine("✅ Patient user seeded: patient1 / password123");
        }

        var existingPatient = await _patients.Find(p => p.UserId == patientUser.Id).FirstOrDefaultAsync();
        if (existingPatient == null)
        {
            existingPatient = new Patient
            {
                UserId = patientUser.Id,
                MedicalRecordNumber = "MRN-001",
                BloodType = "A+",
                Allergies = new List<string> { "Penicillin", "Shellfish" },
                ChronicConditions = new List<string> { "Hypertension" },
                EmergencyContact = new EmergencyContact
                {
                    Name = "Jane Doe",
                    Phone = "+1 (555) 019-2839",
                    Relationship = "Spouse"
                },
                InsuranceInfo = new InsuranceInfo
                {
                    Provider = "BlueCross BlueShield",
                    PolicyNumber = "HP-123456",
                    GroupNumber = "GRP-001"
                },
                CreatedAt = now,
                UpdatedAt = now
            };
            await _patients.InsertOneAsync(existingPatient);
            Console.WriteLine("✅ Patient profile record created.");
        }

        // 3. Seed Doctors & their User accounts
        var doctorsData = new[]
        {
            new
            {
                Username = "sarah.johnson",
                Email = "sarah.johnson@healthcare.com",
                FirstName = "Dr. Sarah",
                LastName = "Johnson",
                Specialty = "Cardiology",
                MedicalSchool = "Harvard Medical School",
                Experience = 15,
                Fee = 150.00m,
                License = "MD-CA-10293",
                Phone = "+1 (555) 123-4567",
                Image = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
                Bio = "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in interventional cardiology and preventive cardiovascular medicine.",
                Languages = new List<string> { "English", "Spanish", "French" },
                Certifications = new List<string> { "Board Certified in Cardiovascular Disease", "Advanced Cardiac Life Support (ACLS)", "Fellow of American College of Cardiology" }
            },
            new
            {
                Username = "michael.chen",
                Email = "michael.chen@healthcare.com",
                FirstName = "Dr. Michael",
                LastName = "Chen",
                Specialty = "Pediatrics",
                MedicalSchool = "Johns Hopkins School of Medicine",
                Experience = 12,
                Fee = 120.00m,
                License = "MD-NY-20491",
                Phone = "+1 (555) 234-5678",
                Image = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
                Bio = "Dr. Michael Chen is a dedicated pediatrician specializing in child development, neonatal care, and adolescent general health.",
                Languages = new List<string> { "English", "Mandarin", "Cantonese" },
                Certifications = new List<string> { "American Board of Pediatrics", "Pediatric Advanced Life Support (PALS)" }
            },
            new
            {
                Username = "emily.rodriguez",
                Email = "emily.rodriguez@healthcare.com",
                FirstName = "Dr. Emily",
                LastName = "Rodriguez",
                Specialty = "Dermatology",
                MedicalSchool = "Stanford University School of Medicine",
                Experience = 8,
                Fee = 140.00m,
                License = "MD-TX-30948",
                Phone = "+1 (555) 345-6789",
                Image = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
                Bio = "Dr. Emily Rodriguez specializes in medical and cosmetic dermatology, skin cancer screening, and innovative dermatological laser treatments.",
                Languages = new List<string> { "English", "Spanish" },
                Certifications = new List<string> { "American Board of Dermatology", "Fellow of American Academy of Dermatology" }
            },
            new
            {
                Username = "james.wilson",
                Email = "james.wilson@healthcare.com",
                FirstName = "Dr. James",
                LastName = "Wilson",
                Specialty = "Orthopedics",
                MedicalSchool = "Columbia University Vagelos College",
                Experience = 20,
                Fee = 180.00m,
                License = "MD-IL-40192",
                Phone = "+1 (555) 456-7890",
                Image = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
                Bio = "Dr. James Wilson is a renowned orthopedic surgeon with twenty years of expertise in joint replacement, sports injuries, and musculoskeletal health.",
                Languages = new List<string> { "English" },
                Certifications = new List<string> { "American Board of Orthopaedic Surgery", "Fellow of American Association of Orthopaedic Surgeons" }
            },
            new
            {
                Username = "lisa.thompson",
                Email = "lisa.thompson@healthcare.com",
                FirstName = "Dr. Lisa",
                LastName = "Thompson",
                Specialty = "Neurology",
                MedicalSchool = "Yale School of Medicine",
                Experience = 14,
                Fee = 160.00m,
                License = "MD-MA-50281",
                Phone = "+1 (555) 567-8901",
                Image = "https://images.unsplash.com/photo-1594824813589-980e927c3e5a?auto=format&fit=crop&w=400&q=80",
                Bio = "Dr. Lisa Thompson specializes in neurology with particular focus on headache and migraine disorders, stroke recovery, and neuromuscular conditions.",
                Languages = new List<string> { "English", "German" },
                Certifications = new List<string> { "American Board of Psychiatry and Neurology" }
            },
            new
            {
                Username = "doctor1",
                Email = "doctor1@healthcare.com",
                FirstName = "Dr. Jane",
                LastName = "Smith",
                Specialty = "Internal Medicine",
                MedicalSchool = "Harvard Medical School",
                Experience = 10,
                Fee = 150.00m,
                License = "MD123456",
                Phone = "+1234567891",
                Image = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
                Bio = "Experienced internal medicine physician providing compassionate, evidence-based care for comprehensive adult health.",
                Languages = new List<string> { "English", "Spanish" },
                Certifications = new List<string> { "Board Certified Internal Medicine" }
            }
        };

        foreach (var docInfo in doctorsData)
        {
            var user = await _users.Find(u => u.Email == docInfo.Email || u.Username == docInfo.Username).FirstOrDefaultAsync();
            if (user == null)
            {
                user = new User
                {
                    Username = docInfo.Username,
                    Email = docInfo.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                    Role = "Doctor",
                    FirstName = docInfo.FirstName,
                    LastName = docInfo.LastName,
                    Phone = docInfo.Phone,
                    LicenseNumber = docInfo.License,
                    ProfileImageUrl = docInfo.Image,
                    AvatarColor = "from-emerald-500 to-teal-600",
                    AvatarEmoji = "👨‍⚕️",
                    CreatedAt = now,
                    UpdatedAt = now
                };
                await _users.InsertOneAsync(user);
            }

            var doctor = await _doctors.Find(d => d.UserId == user.Id || d.LicenseNumber == docInfo.License).FirstOrDefaultAsync();
            if (doctor == null)
            {
                doctor = new Doctor
                {
                    UserId = user.Id,
                    LicenseNumber = docInfo.License,
                    Specialization = docInfo.Specialty,
                    MedicalSchool = docInfo.MedicalSchool,
                    YearsOfExperience = docInfo.Experience,
                    ConsultationFee = docInfo.Fee,
                    Biography = docInfo.Bio,
                    ProfileImageUrl = docInfo.Image,
                    Languages = docInfo.Languages,
                    Certifications = docInfo.Certifications,
                    IsAvailable = true,
                    CreatedAt = now,
                    UpdatedAt = now
                };
                await _doctors.InsertOneAsync(doctor);
                Console.WriteLine($"✅ Doctor seeded: {docInfo.FirstName} {docInfo.LastName} ({docInfo.Specialty})");
            }
        }

        // 4. Seed Pharmacies & their Pharmacist accounts
        var pharmaciesData = new[]
        {
            new
            {
                Username = "pharmacist1",
                Email = "pharmacist1@healthcare.com",
                PharmacyName = "HealthPlus Pharmacy",
                License = "RX789012",
                Address = "123 Main St, Downtown",
                City = "Anytown",
                State = "CA",
                Zip = "12345",
                Phone = "+1 (555) 123-4567",
                Hours = new List<string> { "Mon-Fri: 8:00 AM - 9:00 PM", "Sat-Sun: 9:00 AM - 6:00 PM" },
                IsOpen24 = false,
                Delivery = true,
                Fee = 5.00m,
                Services = new List<string> { "Prescription Refills", "Home Delivery", "Health Screenings", "Immunizations" },
                Image = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80"
            },
            new
            {
                Username = "healthguard",
                Email = "orders@healthguard.com",
                PharmacyName = "Healthguard Pharmacy",
                License = "RX-HG-001",
                Address = "Unity Plaza, Colombo 04",
                City = "Colombo",
                State = "Western",
                Zip = "00400",
                Phone = "+94 11 234 5678",
                Hours = new List<string> { "Open 24/7" },
                IsOpen24 = true,
                Delivery = true,
                Fee = 3.50m,
                Services = new List<string> { "24/7 Service", "Home Delivery", "Insurance Direct Billing", "Specialist Medicines" },
                Image = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
            },
            new
            {
                Username = "unionpharmacy",
                Email = "info@unionpharmacy.com",
                PharmacyName = "Union Pharmacy",
                License = "RX-UP-002",
                Address = "No 142 Main Street, Colombo 11",
                City = "Colombo",
                State = "Western",
                Zip = "01100",
                Phone = "+94 11 345 6789",
                Hours = new List<string> { "8:00 AM - 10:00 PM" },
                IsOpen24 = false,
                Delivery = true,
                Fee = 4.00m,
                Services = new List<string> { "Prescription Refills", "Consultation Available", "Online Orders" },
                Image = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80"
            },
            new
            {
                Username = "asiripharmacy",
                Email = "care@asiripharmacy.com",
                PharmacyName = "Asiri Pharmacy",
                License = "RX-AP-003",
                Address = "Kirula Road, Colombo 05",
                City = "Colombo",
                State = "Western",
                Zip = "00500",
                Phone = "+94 11 456 7890",
                Hours = new List<string> { "7:00 AM - 11:00 PM" },
                IsOpen24 = false,
                Delivery = true,
                Fee = 4.50m,
                Services = new List<string> { "Medical Supplies", "Health Screening", "Vaccine Available" },
                Image = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80"
            },
            new
            {
                Username = "lankahospitalsrx",
                Email = "rx@lankahospitals.com",
                PharmacyName = "Lanka Hospitals Pharmacy",
                License = "RX-LH-004",
                Address = "Elvitigala Mawatha, Colombo 05",
                City = "Colombo",
                State = "Western",
                Zip = "00500",
                Phone = "+94 11 567 8901",
                Hours = new List<string> { "8:00 AM - 8:00 PM" },
                IsOpen24 = false,
                Delivery = true,
                Fee = 5.00m,
                Services = new List<string> { "Hospital Pharmacy", "Specialist Medicines", "Insurance Direct Billing" },
                Image = "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80"
            }
        };

        foreach (var pInfo in pharmaciesData)
        {
            var user = await _users.Find(u => u.Email == pInfo.Email || u.Username == pInfo.Username).FirstOrDefaultAsync();
            if (user == null)
            {
                user = new User
                {
                    Username = pInfo.Username,
                    Email = pInfo.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                    Role = "Pharmacist",
                    FirstName = pInfo.PharmacyName,
                    LastName = "Staff",
                    Phone = pInfo.Phone,
                    LicenseNumber = pInfo.License,
                    ProfileImageUrl = pInfo.Image,
                    AvatarColor = "from-cyan-500 to-blue-600",
                    AvatarEmoji = "💊",
                    CreatedAt = now,
                    UpdatedAt = now
                };
                await _users.InsertOneAsync(user);
            }

            var pharmacy = await _pharmacies.Find(p => p.PharmacyName == pInfo.PharmacyName || p.LicenseNumber == pInfo.License).FirstOrDefaultAsync();
            if (pharmacy == null)
            {
                pharmacy = new Pharmacy
                {
                    UserId = user.Id,
                    PharmacyName = pInfo.PharmacyName,
                    LicenseNumber = pInfo.License,
                    Address = pInfo.Address,
                    City = pInfo.City,
                    State = pInfo.State,
                    ZipCode = pInfo.Zip,
                    Phone = pInfo.Phone,
                    Email = pInfo.Email,
                    OperatingHours = pInfo.Hours,
                    IsOpen24Hours = pInfo.IsOpen24,
                    OffersDelivery = pInfo.Delivery,
                    DeliveryFee = pInfo.Fee,
                    Services = pInfo.Services,
                    ProfileImageUrl = pInfo.Image,
                    IsActive = true,
                    CreatedAt = now,
                    UpdatedAt = now
                };
                await _pharmacies.InsertOneAsync(pharmacy);
                Console.WriteLine($"✅ Pharmacy seeded: {pInfo.PharmacyName}");
            }
        }

        // 5. Seed Comprehensive Drug Database
        var drugsCount = await _drugs.CountDocumentsAsync(_ => true);
        if (drugsCount < 8)
        {
            var standardDrugs = new List<DrugDatabase>
            {
                new DrugDatabase
                {
                    DrugName = "Metformin 500mg",
                    GenericName = "Metformin Hydrochloride",
                    BrandNames = new List<string> { "Glucophage" },
                    Category = "Antidiabetic",
                    Indications = new List<string> { "Type 2 Diabetes Mellitus" },
                    DosageForms = new List<string> { "Tablet" },
                    Strengths = new List<string> { "500mg", "850mg", "1000mg" },
                    CreatedAt = now, UpdatedAt = now
                },
                new DrugDatabase
                {
                    DrugName = "Lisinopril 10mg",
                    GenericName = "Lisinopril",
                    BrandNames = new List<string> { "Prinivil", "Zestril" },
                    Category = "ACE Inhibitor",
                    Indications = new List<string> { "Hypertension", "Heart Failure" },
                    DosageForms = new List<string> { "Tablet" },
                    Strengths = new List<string> { "5mg", "10mg", "20mg" },
                    CreatedAt = now, UpdatedAt = now
                },
                new DrugDatabase
                {
                    DrugName = "Albuterol Inhaler",
                    GenericName = "Albuterol Sulfate",
                    BrandNames = new List<string> { "Ventolin", "ProAir" },
                    Category = "Bronchodilator",
                    Indications = new List<string> { "Asthma", "COPD" },
                    DosageForms = new List<string> { "Aerosol Inhaler" },
                    Strengths = new List<string> { "90mcg" },
                    CreatedAt = now, UpdatedAt = now
                },
                new DrugDatabase
                {
                    DrugName = "Amoxicillin 500mg",
                    GenericName = "Amoxicillin",
                    BrandNames = new List<string> { "Amoxil" },
                    Category = "Antibiotic",
                    Indications = new List<string> { "Bacterial Infections" },
                    DosageForms = new List<string> { "Capsule" },
                    Strengths = new List<string> { "250mg", "500mg" },
                    CreatedAt = now, UpdatedAt = now
                },
                new DrugDatabase
                {
                    DrugName = "Atorvastatin 20mg",
                    GenericName = "Atorvastatin Calcium",
                    BrandNames = new List<string> { "Lipitor" },
                    Category = "Statin",
                    Indications = new List<string> { "Hypercholesterolemia", "Cardiovascular Prevention" },
                    DosageForms = new List<string> { "Tablet" },
                    Strengths = new List<string> { "10mg", "20mg", "40mg" },
                    CreatedAt = now, UpdatedAt = now
                },
                new DrugDatabase
                {
                    DrugName = "Omeprazole 20mg",
                    GenericName = "Omeprazole",
                    BrandNames = new List<string> { "Prilosec" },
                    Category = "Proton Pump Inhibitor",
                    Indications = new List<string> { "GERD", "Gastric Ulcers" },
                    DosageForms = new List<string> { "Delayed-release Capsule" },
                    Strengths = new List<string> { "20mg", "40mg" },
                    CreatedAt = now, UpdatedAt = now
                },
                new DrugDatabase
                {
                    DrugName = "Ibuprofen 600mg",
                    GenericName = "Ibuprofen",
                    BrandNames = new List<string> { "Advil", "Motrin" },
                    Category = "NSAID",
                    Indications = new List<string> { "Pain Relief", "Inflammation", "Fever" },
                    DosageForms = new List<string> { "Tablet" },
                    Strengths = new List<string> { "400mg", "600mg", "800mg" },
                    CreatedAt = now, UpdatedAt = now
                },
                new DrugDatabase
                {
                    DrugName = "Sertraline 50mg",
                    GenericName = "Sertraline Hydrochloride",
                    BrandNames = new List<string> { "Zoloft" },
                    Category = "SSRI",
                    Indications = new List<string> { "Depression", "Anxiety", "PTSD" },
                    DosageForms = new List<string> { "Tablet" },
                    Strengths = new List<string> { "25mg", "50mg", "100mg" },
                    CreatedAt = now, UpdatedAt = now
                }
            };

            foreach (var drug in standardDrugs)
            {
                var existing = await _drugs.Find(d => d.DrugName == drug.DrugName).FirstOrDefaultAsync();
                if (existing == null)
                {
                    await _drugs.InsertOneAsync(drug);
                }
            }
            Console.WriteLine("✅ Drug database updated with standard medications.");
        }

        // 6. Seed Sample Appointments
        var appointmentsCount = await _appointments.CountDocumentsAsync(_ => true);
        if (appointmentsCount == 0 && patientUser != null)
        {
            var firstDoc = await _doctors.Find(_ => true).FirstOrDefaultAsync();
            var firstDocUser = firstDoc != null ? await _users.Find(u => u.Id == firstDoc.UserId).FirstOrDefaultAsync() : null;

            var sampleAppointments = new List<Appointment>
            {
                new Appointment
                {
                    PatientId = patientUser.Id,
                    PatientName = $"{patientUser.FirstName} {patientUser.LastName}".Trim(),
                    PatientEmail = patientUser.Email,
                    DoctorId = firstDoc?.Id ?? "doc-001",
                    DoctorName = firstDocUser != null ? $"{firstDocUser.FirstName} {firstDocUser.LastName}".Trim() : "Dr. Sarah Johnson",
                    DoctorSpecialty = firstDoc?.Specialization ?? "Cardiology",
                    AppointmentDate = DateTime.UtcNow.AddDays(2),
                    TimeSlot = "10:30 AM",
                    Reason = "Annual Cardiovascular Health Checkup",
                    Notes = "Routine follow-up, please bring previous ECG reports.",
                    Status = "confirmed",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Appointment
                {
                    PatientId = patientUser.Id,
                    PatientName = $"{patientUser.FirstName} {patientUser.LastName}".Trim(),
                    PatientEmail = patientUser.Email,
                    DoctorId = firstDoc?.Id ?? "doc-001",
                    DoctorName = firstDocUser != null ? $"{firstDocUser.FirstName} {firstDocUser.LastName}".Trim() : "Dr. Sarah Johnson",
                    DoctorSpecialty = firstDoc?.Specialization ?? "Cardiology",
                    AppointmentDate = DateTime.UtcNow.AddDays(7),
                    TimeSlot = "2:00 PM",
                    Reason = "Blood Pressure Consultation",
                    Notes = "Checkup on prescribed medications.",
                    Status = "pending",
                    CreatedAt = now,
                    UpdatedAt = now
                }
            };

            await _appointments.InsertManyAsync(sampleAppointments);
            Console.WriteLine("✅ Sample appointments created in MongoDB.");
        }

        // 7. Seed Sample Prescriptions
        var rxCount = await _prescriptions.CountDocumentsAsync(_ => true);
        if (rxCount < 3 && existingPatient != null && patientUser != null)
        {
            var firstDoctor = await _doctors.Find(_ => true).FirstOrDefaultAsync();
            var sampleDrugs = await _drugs.Find(_ => true).Limit(3).ToListAsync();

            var samplePrescriptions = new List<Prescription>
            {
                new Prescription
                {
                    PrescriptionNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-001",
                    DoctorId = firstDoctor?.UserId ?? "doctor-001",
                    PatientId = existingPatient.Id,
                    PharmacyName = "HealthPlus Pharmacy",
                    Medications = new List<Medication>
                    {
                        new Medication
                        {
                            DrugName = "Metformin 500mg",
                            Dosage = "500mg",
                            Frequency = "Twice daily with meals",
                            Duration = "30 days",
                            Quantity = 60,
                            RefillsAllowed = 3,
                            Instructions = "Take morning and evening with food"
                        }
                    },
                    Diagnosis = "Type 2 Diabetes Maintenance",
                    Status = "Approved",
                    DigitalSignature = $"SIGNED-{firstDoctor?.UserId ?? "doc"}-{DateTime.UtcNow:yyyyMMdd}",
                    ExpiryDate = DateTime.UtcNow.AddMonths(6),
                    Notes = "Regular monitoring of blood glucose required.",
                    CreatedAt = now.AddDays(-2),
                    UpdatedAt = now.AddDays(-2)
                },
                new Prescription
                {
                    PrescriptionNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-002",
                    DoctorId = firstDoctor?.UserId ?? "doctor-001",
                    PatientId = existingPatient.Id,
                    PharmacyName = "Healthguard Pharmacy",
                    Medications = new List<Medication>
                    {
                        new Medication
                        {
                            DrugName = "Lisinopril 10mg",
                            Dosage = "10mg",
                            Frequency = "Once daily",
                            Duration = "30 days",
                            Quantity = 30,
                            RefillsAllowed = 2,
                            Instructions = "Take in the morning"
                        }
                    },
                    Diagnosis = "Essential Hypertension",
                    Status = "Dispensed",
                    DigitalSignature = $"SIGNED-{firstDoctor?.UserId ?? "doc"}-{DateTime.UtcNow:yyyyMMdd}",
                    ExpiryDate = DateTime.UtcNow.AddMonths(6),
                    Notes = "Keep hydrated and record blood pressure weekly.",
                    CreatedAt = now.AddDays(-5),
                    UpdatedAt = now.AddDays(-1)
                }
            };

            await _prescriptions.InsertManyAsync(samplePrescriptions);
            Console.WriteLine("✅ Sample prescriptions created in MongoDB.");
        }

        Console.WriteLine();
        Console.WriteLine("======================================================");
        Console.WriteLine("🎉 MongoDB database verified and ready!");
        Console.WriteLine("======================================================");
    }
}