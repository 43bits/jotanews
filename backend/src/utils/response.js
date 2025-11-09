export const ok = (res, data = {}, status = 200) => res.status(status).json({ success: true, data });
export const bad = (res, message = 'Bad Request', status = 400) => res.status(status).json({ success: false, error: message });
export const fail = (res, message = 'Server Error', status = 500) => res.status(status).json({ success: false, error: message });