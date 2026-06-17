import React, { useEffect, useState } from 'react'
import { serviceListApi } from '../../api/serviceBookingApi';
import Loader from '../../components/common/Loader';
import Service from '../../components/users/Service';

export default function ServiceList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const result = await serviceListApi();
                const data = result.data;
                console.log("Fetched services:", data);
                setServices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) return <Loader />;
    if (error) return <div className="alert alert-danger m-4">Error: {error}</div>;

    return (
        <div>
            {/* Banner */}
            <div
                className="d-flex align-items-center justify-content-center text-white text-center mb-4"
                style={{
                    height: '300px',
                    background: 'linear-gradient(135deg, #4CAF50, #2196F3)',
                }}
            >
                <div>
                    <h1 className="display-4 fw-bold">Our Services</h1>
                    <p className="lead">Find and book the best services tailored for you</p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mb-5">
                <div className="row g-4">
                    {services.map(service => (
                        <div key={service.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <Service service={service} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}