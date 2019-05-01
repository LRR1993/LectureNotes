class Auth extends Component {

  state = { username: '' };

  handleSubmit = e => {
    e.preventDefault();
  };
  handleChange = e => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };
  render() {
    const { username } = this.state;
    const { user, children } = this.props;

    return (
      <div>
        {user ? children : <form>
          <label>Username:</label>
          <input value={username} onChange={this.handleChange} id={username} />
          <button type="submit" onsubmit={this.handleSubmit} />
        </form>}
      </div>
    );
  }
}

export default Auth;