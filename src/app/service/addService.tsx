import { Icon } from "@iconify/react/dist/iconify.js";
import TimeSlotCreator from "./time-range-selector";
import CityMultiSelector from "./citySelector";

const AddService = () => {
    const cities = [
        'New York',
        'London',
        'Tokyo',
        'Paris',
        'Berlin',
        'Mumbai',
        'Sydney',
        'Toronto',
        'Chicago',
        'Los Angeles',
        'San Francisco',
        'Seattle',
        'Austin',
        'Denver',
        'Miami',
        'Boston',
        'Philadelphia',
        'Atlanta',
        'Phoenix',
        'San Diego',
      ];
    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h6 className="card-title mb-0">Default Inputs</h6>
                </div>
                <div className="card-body">
                    <div className="row gy-3">
                        <div className="col-12">
                            <label className="form-label">Basic Input</label>
                            <input type="text" name="#0" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Input with Placeholder</label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="info@gmail.com"
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Input with Phone </label>
                            <input
                                type="text"
                                className="form-control flex-grow-1"
                                placeholder="+1 (555) 253-08515"
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Input Date</label>
                            <input type="date" name="#0" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Input with Payment</label>
                            <div className="input-group">
                                <span className="input-group-text bg-base">
                                    <img src="assets/images/card/payment-icon.png" alt="image_icon" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control flex-grow-1"
                                    placeholder="Card number"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* card end */}
            <TimeSlotCreator title="Service Slot" />
            {/* card end */}
            <CityMultiSelector cities={cities} />
        </div>
    );
};

export default AddService;