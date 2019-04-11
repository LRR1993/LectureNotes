import React, { Component } from 'react';
import Heading from './components/Heading';
import TaskAdder from './components/TaskAdder';
import TaskList from './components/TaskList';
import './App.css';

// class based component

// const tasks = ['eat', 'sleep', 'react', 'have lunch'];

class App extends Component {
  state = {
    tasks: [
      { text: 'eat', completed: false },
      { text: 'sleep', completed: true },
      { text: 'react', completed: false }
    ]
  };

  render() {
    console.log('rendering...', this.state);
    return (
      <div className="App">
        <Heading name="Paul" />
        <TaskAdder addTask={this.addTask} />
        <TaskList tasks={this.state.tasks} removeTask={this.removeTask} />
      </div>
    );
  }

  addTask = taskToAdd => {
    this.setState(state => ({
      tasks: [taskToAdd, ...state.tasks]
    }));
  };

  removeTask = taskToRemove => {
    this.setState(state => {
      return {
        tasks: state.tasks.filter(task => task !== taskToRemove)
      };
    });
  };
}

export default App;
