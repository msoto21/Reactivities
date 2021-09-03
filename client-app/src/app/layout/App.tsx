import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]); // activities is the variable to store our state, and setActities is a function to set the state.
  const [selectedActivity, setSelectedActitivy] = useState<Activity | undefined>(undefined); // In the useState we're saying that the it can be either an Activity or undefined and its initial state is undefined.
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
    })
  }, []) // this is empty array of dependencies which we don't have at this satege, and will prevent the code before the comma to repeat indefinitely given the change of state.

  function handleSelectActivity(id: string) {
    setSelectedActitivy(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActitivy(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function HandleCreateOrEditActivity(activity: Activity) {
    activity.id 
      ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
      : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActitivy(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  return (
    <Fragment>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={HandleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          />
      </Container>
    </Fragment>
  );
}

export default App;
