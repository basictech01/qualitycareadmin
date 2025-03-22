import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, FloatingLabel, Badge } from 'react-bootstrap';
import moment from 'moment';

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface TimeSlotCreatorProps {
  serviceTimeSlots:TimeRange[]
  title: string;
  onTimeRangesChange?: (timeRanges: TimeRange[]) => void;
}

const TimeSlotCreator: React.FC<TimeSlotCreatorProps> = ({ 
  title = "Schedule Availability", 
  serviceTimeSlots,
  onTimeRangesChange 
}) => {
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    { startTime: '09:00', endTime: '17:00' }
  ]);

  useEffect(() => {
    console.log(serviceTimeSlots,"timeslot")
    // Notify parent component when timeRanges change
    onTimeRangesChange && onTimeRangesChange(timeRanges);
  }, [timeRanges, onTimeRangesChange]);

  const handleAddTimeRange = () => {
    setTimeRanges([...timeRanges, { startTime: '09:00', endTime: '17:00' }]);
  };

  const handleRemoveTimeRange = (index: number) => {
    const updatedTimeRanges = [...timeRanges];
    updatedTimeRanges.splice(index, 1);
    setTimeRanges(updatedTimeRanges);
  };

  const handleStartTimeChange = (index: number, value: string) => {
    const updatedTimeRanges = [...timeRanges];
    updatedTimeRanges[index].startTime = value;
    setTimeRanges(updatedTimeRanges);
  };

  const handleEndTimeChange = (index: number, value: string) => {
    const updatedTimeRanges = [...timeRanges];
    updatedTimeRanges[index].endTime = value;
    setTimeRanges(updatedTimeRanges);
  };

  const createTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeValue = moment().hour(hour).minute(minute).format('HH:mm');
        const timeLabel = moment().hour(hour).minute(minute).format('h:mm A');
        options.push(
          <option key={timeValue} value={timeValue}>
            {timeLabel}
          </option>
        );
      }
    }
    return options;
  };

  // Calculate total hours scheduled
  const calculateTotalHours = (): string => {
    let totalMinutes = 0;
    
    timeRanges.forEach(range => {
      const startMoment = moment(range.startTime, 'HH:mm');
      const endMoment = moment(range.endTime, 'HH:mm');
      
      if (endMoment.isAfter(startMoment)) {
        const duration = moment.duration(endMoment.diff(startMoment));
        totalMinutes += duration.asMinutes();
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  };

  const isValidTimeRange = (range: TimeRange): boolean => {
    return moment(range.endTime, 'HH:mm').isAfter(moment(range.startTime, 'HH:mm'));
  };

  return (
    <Card className="">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3 border-bottom">
        <div className="d-flex align-items-center">
          <i className="bi bi-clock me-2 text-primary"></i>
          <h4 className="card-title mb-0" style={{ color: "#666666" }}>{title}</h4>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={handleAddTimeRange}
          className="d-flex align-items-center"
        >
          <span className="me-1">+</span> Add Time Slot
        </Button>
      </Card.Header>
      
      <Card.Body className="p-3">
        {timeRanges.length === 0 ? (
          <div className="text-center py-3 text-muted">
            <i className="bi bi-clock fs-4"></i>
            <p className="mt-2">No time slots added yet. Click "Add Time Slot" to begin.</p>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between mb-2">
              <Badge bg="info" className="fs-6 py-1 px-3">
                Total scheduled: {calculateTotalHours()}
              </Badge>
            </div>
            
            <div className="time-slots-container">
              {timeRanges.map((range, index) => (
                <div key={index} className={`rounded ${!isValidTimeRange(range) ? 'border-danger' : 'border-light'} mb-2 p-2 bg-white`}>
                  <Row className="align-items-center g-2">
                    <Col md={4}>
                      <FloatingLabel controlId={`start-time-${index}`} label="Start Time">
                        <Form.Select
                          value={range.startTime}
                          onChange={(e) => handleStartTimeChange(index, e.target.value)}
                          className={!isValidTimeRange(range) ? 'border-danger' : ''}
                        >
                          {createTimeOptions()}
                        </Form.Select>
                      </FloatingLabel>
                    </Col>

                    <Col md={4}>
                      <FloatingLabel controlId={`end-time-${index}`} label="End Time">
                        <Form.Select
                          value={range.endTime}
                          onChange={(e) => handleEndTimeChange(index, e.target.value)}
                          className={!isValidTimeRange(range) ? 'border-danger' : ''}
                        >
                          {createTimeOptions()}
                        </Form.Select>
                      </FloatingLabel>
                    </Col>

                    <Col md={4} className="d-flex align-items-center justify-content-end">
                      {!isValidTimeRange(range) && (
                        <small className="text-danger me-2">Invalid time</small>
                      )}
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveTimeRange(index)}
                        disabled={timeRanges.length === 1}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </>
        )}
      </Card.Body>
    
      
    </Card>
  );
};

export default TimeSlotCreator;