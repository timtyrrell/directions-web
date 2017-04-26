import moment from 'moment'
import DateTime from './date-time'

class Directions extends React.Component {
  constructor(...args) {
    super(...args)

    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    this.state = {
      duration: '',
      form: {
        arrivalDateTime: '',
        destination: 'Austin, TX',
        origin: 'Round Rock, TX',
      },
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderDuration= this.renderDuration.bind(this)
  }

  handleInputChange(event) {
    let name, value = null

    if (event._d) {
      name = 'arrivalDateTime'
      value = event._d
    } else {
      name = event.target.name
      value = event.target.value
    }

    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      }
    })
  }

  handleSubmit(event) {
    const {
      arrivalDateTime,
      destination,
      origin,
    } = this.state.form

    fetch('http://localhost:3002/directions', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        arrivalDateTime,
        destination,
        origin,
      }),
    })
      .then(response => response.json())
      .then(response => this.setState({ duration: response.duration }))

    event.preventDefault()
  }

  renderDuration() {
    if (this.state.duration.length === 0) {
      return null
    }
    // render time - duration for leaving time
    return <div>Duration: { this.state.duration }</div>
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit }>
        <label>
          Starting location:
          <input
            name="origin"
            onChange={ this.handleInputChange }
            type="text"
            value={ this.state.form.origin }
          />
        </label>
        <label>
          Destination:
          <input
            name="destination"
            onChange={ this.handleInputChange }
            type="text"
            value={ this.state.form.destination }
          />
        </label>
        <label>
          Arrival Date/Time:
          <DateTime
            inputProps={ { name: 'arrivalDateTime' } }
            onChange={ this.handleInputChange }
            value={ this.state.form.arrivalDateTime }
          />
        </label>
        <input type="submit" value="Submit" />
        { this.renderDuration() }
      </form>
    )
  }
}

export default Directions
