import React, { useState } from 'react';
import { Form, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import moment from 'moment';

interface TimeRange {
    startTime: string;
    endTime: string;
}

interface TimeSlotCreatorProps {
    title: string;
    onTimeRangesChange?: (timeRanges: TimeRange[]) => void;
}

const TimeSlotCreator: React.FC<TimeSlotCreatorProps> = ({ title, onTimeRangesChange }) => {
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{ startTime: '09:00', endTime: '17:00', }]);

  const changeTimeRanges = (timeRanges: TimeRange[]) => {
    onTimeRangesChange && onTimeRangesChange(timeRanges);
    setTimeRanges(timeRanges);
  }

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
        const time = moment().hour(hour).minute(minute).format('HH:mm');
        options.push(<option key={time} value={time}>{time}</option>);
      }
    }
    return options;
  };

  return (
    <div className="card ">
      <div className='card-header row'>
        <h4 className='card-title col-8 text-center'>{title}</h4>
        <Button  onClick={handleAddTimeRange} className=" col-4">
          Add Time Slot
        </Button>
      </div>
      <div className="card-body">
      {timeRanges.map((range, index) => (
        <Row key={index} className="mb-3">
          <Col md={4}>
            <FloatingLabel controlId={`start-time-${index}`} label="Start Time">
              <Form.Select
                value={range.startTime}
                onChange={(event) => handleStartTimeChange(index, event.target.value)}
              >
                {createTimeOptions()}
              </Form.Select>
            </FloatingLabel>
          </Col>

          <Col md={4}>
            <FloatingLabel controlId={`end-time-${index}`} label="End Time">
              <Form.Select
                value={range.endTime}
                onChange={(event) => handleEndTimeChange(index, event.target.value)}
              >
                {createTimeOptions()}
              </Form.Select>
            </FloatingLabel>
          </Col>

          <Col md={4} className="d-flex align-items-center justify-content-end">
            <Button variant="danger" onClick={() => handleRemoveTimeRange(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      </div>
    </div>
  );
};

export default TimeSlotCreator;