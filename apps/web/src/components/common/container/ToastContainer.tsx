import { ToastContainer as ToastifyContainer, toast } from 'react-toastify';
import React, { useEffect } from 'react';
import { useContainer } from 'src/utils/container/context';
import { ApiService } from 'src/services/api.service';

export function ToastContainer() {
    const container = useContainer();
    useEffect(() => {
        const apiService = container.get(ApiService);
        apiService.errorSubscription.subscribe((e: any) => {
            if (e.response?.status >= 400 && e.response?.status < 500) {
                toast.warn(e.response.data.error || e.response?.statusText, {
                    toastId: 'warn',
                });
            }

            if (e.response?.status >= 500) {
                toast.error(e.response?.statusText, {
                    toastId: 'error',
                });
            }
        });
    }, []);
    return <ToastifyContainer hideProgressBar={true} />;
}
