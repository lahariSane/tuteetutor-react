export const validateLeaveRequestForm = (formData) => {
    const errors = {};

    if (!formData.get("studentName")) {
        errors.studentName = 'Student name is required';
    }

    if (!formData.get("studentID")) {
        errors.studentID = 'Student ID is required';
    }

    if (!formData.get("fromDate")) {
        errors.fromDate = 'From date is required';
    }

    if (!formData.get("toDate")) {
        errors.toDate = 'To date is required';
    }

    if (!formData.get("reason")) {
        errors.reason = 'Reason is required';
    }



    return errors;
};