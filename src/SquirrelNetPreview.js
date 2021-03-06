import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import './SquirrelNetPreview.css';

const PREVIEWS = [
  {
    url: 'https://s3-us-west-2.amazonaws.com/doggoai/squirrel01.jpg',
    thumb: 'https://s3-us-west-2.amazonaws.com/doggoai/squirrel01_thumbnail.png'
  },
  {
    url: 'https://s3-us-west-2.amazonaws.com/doggoai/squirrel02.jpg',
    thumb: 'https://s3-us-west-2.amazonaws.com/doggoai/squirrel02_thumbnail.png'
  },
  {
    url: 'https://s3-us-west-2.amazonaws.com/doggoai/squirrel03.jpg',
    thumb: 'https://s3-us-west-2.amazonaws.com/doggoai/squirrel03_thumbnail.png'
  },
  {
    url: 'https://s3-us-west-2.amazonaws.com/doggoai/squirrel04.jpg',
    thumb: 'https://s3-us-west-2.amazonaws.com/doggoai/squirrel04_thumbnail.png'
  },
];

class SquirrelNetPreview extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      url: '',
      error: null,
      annotatedResponse: null
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (e) => {
    this.setState({
      url: e.target.value
    });
  }

  async onSubmit(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      loading: true
    });
    try {
      let response = await fetch('https://api.doggoai.com/annotations', {
        method: 'POST',
        body: JSON.stringify({ url: this.state.url })
      })
      if (response.ok) {
        let annotations = await response.json();
        if (annotations.error) {
          this.setState({
            loading: false,
            error: annotations.error
          });
        } else {
          this.setState({
            loading: false,
            annotatedResponse: annotations
          });
        }
      } else {
        this.setState({
          loading: false,
          error: 'Error response from server'
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
        error: 'Exception thrown from server'
      });
    }
  }

  setUrlAndSubmit = (url) => {
    this.setState({ url }, this.onSubmit);
  }

  reset = () => {
    this.setState({
      url: '',
      error: null,
      annotatedResponse: null
    });
  }

  getImageScale(height, width) {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.75;
    const heightScale = Math.min(1, maxHeight / height);
    const widthScale = Math.min(1, maxWidth / width)
    return Math.min(heightScale, widthScale);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="SquirrelNetPreview flex-centered">
          <div className="loading">
            <FontAwesome name="paw" size="2x" />
            <p>Fetching...</p>
          </div>
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className="SquirrelNetPreview flex-centered">
          <h2 className="error">An error occurred, please try again.</h2>
          <div className="btn flex-centered" onClick={this.reset}>Reset</div>
        </div>
      );
    } else if (
      this.state.annotatedResponse &&
      this.state.annotatedResponse.image
      ) {
      let {
        image,
        timetaken,
        annotations
      } = this.state.annotatedResponse;
      annotations = annotations || [];
      annotations = annotations.filter(a => a.score > 0.9);
      const scale = this.getImageScale(image.height, image.width);
      const numSquirrels = annotations.length;
      return (
        <div className="SquirrelNetPreview flex-centered">
          <div
            style={{
              position: 'relative',
              height: image.height * scale,
              width: image.width * scale
            }}>
            <div style={{
              position: 'absolute',
            }}>
              { annotations.map((a, idx) => (
                  <div
                    key={idx}
                    className="bounding-box flex-centered"
                    style={{
                      position: 'absolute',
                      left: a.rect[0] * scale,
                      top: a.rect[1] * scale,
                      width: (a.rect[2] - a.rect[0]) * scale,
                      height: (a.rect[3] - a.rect[1]) * scale
                    }}
                  >
                    <span className="label">Squirrel!</span>
                  </div>
                ))
              }
            </div>
            <img
              alt="Possibly contains squirrels"
              src={image.url}
              height={image.height * scale}
              width={image.width * scale}
            />
          </div>
          <div className="annotation-meta flex-centered">
            <span>
              <span className="meta-key">Analysis time</span>: <span style={{ color: '#bbdefb' }}>{Math.round(timetaken * 1000) / 1000}s. </span>
              <span className="meta-key">Squirrels found</span>: <span style={{ color: '#f8bbd0' }}>{numSquirrels}</span>.
            </span>
            <span className="btn flex-centered" onClick={this.reset}>Reset</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="SquirrelNetPreview flex-centered">
          <h2>Squirrel detection with advanced CSS positioned bounding boxes for real-time doggos.</h2>
          <div className="preview-grid">
            {
              PREVIEWS.map(p => (
                <div
                  key={p.url}
                  onClick={() => this.setUrlAndSubmit(p.url)}
                  className="preview-square"
                  >
                  <img
                    alt="An example of a squirrel"
                    className="preview-image"
                    src={p.thumb}
                    />
                </div>
              ))
            }
          </div>
          <form
            className="preview-input flex-centered-row"
            onSubmit={this.onSubmit}
            >
            <input onChange={this.onChange} value={this.state.url} placeholder="...or try your own squirrel image url" />
            <span
              onClick={this.state.url ? this.onSubmit : null}
              className={'btn flex-centered' + (this.state.url ? '' : ' disabled')}
              >
              Annotate
            </span>
          </form>
        </div>
      );
    }
  }
}

export default SquirrelNetPreview;