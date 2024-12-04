export const validateLeaveRequestForm = (formData) => {
    const errors = {};

    const fromDate = new Date(formData.get('fromDate'));
    const toDate = new Date(formData.get('toDate'));
    
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

    if (fromDate && toDate && fromDate >= toDate) {
        errors.toDate = "To Date should be later than From Date.";
    }

    if (!formData.get("reason")) {
        errors.reason = 'Reason is required';
    }



    return errors;
};