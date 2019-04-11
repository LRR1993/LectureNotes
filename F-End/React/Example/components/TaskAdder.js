import React from 'react';

class TaskAdder extends React.Component {
  state = {
    newTask: ''
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="new-task">New Task:</label>
        <input
          id="newTask"
          type="text"
          value={this.state.newTask}
          onChange={this.handleChange}
        />
        <button type="submit">Add Task</button>
      </form>
    );
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.addTask({ text: this.state.newTask, completed: false });
    this.setState({
      newTask: ''
    });
  };

  handleChange = event => {
    const { value } = event.target;
    this.setState({
      newTask: value
    });
  };
}

export default TaskAdder;
