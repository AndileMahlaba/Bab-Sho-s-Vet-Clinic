class Doctor {
    constructor(doctorID) {
        this.doctorID = doctorID;
        this.appointments = [];
    }

    updateAppointmentStatus(appointmentID, status) {
        const appointment = this.appointments.find(app => app.id === appointmentID);
        if (appointment) {
            appointment.status = status;
            console.log(`Appointment ID: ${appointmentID} marked as ${status}.`);
        } else {
            console.log(`Appointment ID: ${appointmentID} not found.`);
        }
    }

    viewClientInformation(appointmentID) {
        const appointment = this.appointments.find(app => app.id === appointmentID);
        if (appointment) {
            console.log("Client Information:", appointment.clientInfo);
        } else {
            console.log(`Appointment ID: ${appointmentID} not found.`);
        }
    }
}
