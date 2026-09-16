import React from 'react';

export const DoctorDashboardContext = React.createContext({
  stats: { 
    todayPatients: 0, 
    appointments: 0, 
    pendingScripts: 0, 
    criticalCases: 0, 
    prescriptionsThisMonth: 0, 
    avgPatientsPerDay: 0, 
    adherenceRate: 95 
  },
  patientQueue: [],
  pendingPrescriptions: [],
  clinicalAlerts: [],
  doctorInfo: null,
  loading: false,
  refresh: () => {}
});

export const useDoctorDashboard = () => React.useContext(DoctorDashboardContext);

export default DoctorDashboardContext;
