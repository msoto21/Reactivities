import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]); // activities is the variable to store our state, and setActities is a function to set the state.
  const [selectedActivity, setSelectedActitivy] = useState<Activity | undefined>(undefined); // In the useState we're saying that the it can be either an Activity or undefined and its initial state is undefined.
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {  // axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(response); // setActivities(response.data);
      setLoading(false);
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
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setSelectedActitivy(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
        activity.id = uuid();
        agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActitivy(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }

  if (loading) return <LoadingComponent content='Loading app' />

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
          submitting={submitting}
          />
      </Container>
    </Fragment>
  );
}

export default App;
