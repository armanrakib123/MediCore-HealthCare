import React from 'react'

export default function DoctorCard({ doctor = {} }) {
  return (
    <article className="doctor-card">
      <h3>{doctor.name || 'Dr. Name'}</h3>
      <p>{doctor.specialty || 'Specialty'}</p>
    </article>
  )
}
