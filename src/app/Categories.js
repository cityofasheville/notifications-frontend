import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import { CREATE_USER_PREFERENCE, UPDATE_USER_PREFERENCE } from 'app/mutations';
import { CATEGORIES_QUERY } from 'app/queries';
import { stripTypeNameFromObj } from 'app/utils';
import 'app/styles/components/Categories.scss';


const radiusMilesOpts = [
  0.25,
  0.5,
  1,
  2,
  3,
  'whole city',
];

const tagTranslation = {
  Minor: 'Minor development (Level I)',
  Major: 'Major development (Level II, Major Subdivision, Conditional Zoning, Conditional Use)',
  Affordable: 'Affordable housing included in initial proposal',
  Slope: 'Proposed in an area with a steep slope',
  SoundExceedance: 'Permits applied for Sound Exceedance',
};

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptions: props.userPreference ? (props.userPreference.subscriptions || []) : [],
    };
    this.handleBoxCheck = this.handleBoxCheck.bind(this);
  }


  handleBoxCheck(tag, checked, setUserPreference) {
    let { subscriptions } = this.state;
    subscriptions = [].concat(subscriptions);
    if (checked) {
      subscriptions.push({ tag, whole_city: true, radius_miles: null });
    } else {
      const thisSubIndex = subscriptions.findIndex(d => d.tag.id === tag.id);
      subscriptions.splice(thisSubIndex, 1);
    }
    this.setState({ subscriptions }, () => {
      setUserPreference();
      const { onPrefSaved } = this.props;
      onPrefSaved(tagTranslation[tag.name]);
    });
  }

  handleDropdownChange(tag, selectedValue, setUserPreference) {
    let { subscriptions } = this.state;
    subscriptions = [].concat(subscriptions);
    const thisSubIndex = subscriptions.findIndex(d => d.tag.id === tag.id);
    let newSub;
    if (selectedValue === 'whole city') {
      // Make that subscription whole city, set radius to null
      newSub = Object.assign(
        subscriptions[thisSubIndex],
        { whole_city: true }
      );
    } else {
      // Make whole city null, set radius miles
      newSub = Object.assign(
        subscriptions[thisSubIndex],
        { whole_city: false, radius_miles: parseFloat(selectedValue) }
      );
    }
    subscriptions.splice(thisSubIndex, 1);
    subscriptions.push(newSub);
    this.setState({ subscriptions }, () => {
      setUserPreference();
      const { onPrefSaved } = this.props;
      onPrefSaved(tagTranslation[tag.name]);
    });
  }

  render() {
    const { userPreference } = this.props;
    let { email } = this.props;
    const { subscriptions } = this.state;
    if (userPreference && userPreference.send_types) {
      // Linter error because we can't reassign a variable by destructuring
      email = userPreference.send_types.find(typeObj => typeObj.type === 'EMAIL').email;
    }
    const mutation = userPreference ? UPDATE_USER_PREFERENCE : CREATE_USER_PREFERENCE;
    const newUserPref = stripTypeNameFromObj(Object.assign(
      userPreference || { send_types: { type: 'EMAIL', email } },
      { subscriptions }
    ));
    return (
      <Query
        query={CATEGORIES_QUERY}
      >
        { ({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div className="alert-danger">Sorry, there was an error.</div>;
          return (
            <Mutation
              mutation={mutation}
              variables={{ user_preference: newUserPref }}
            >
              {setUserPreference => (
                <div className="categories-list">
                  {data.categories.map(cat => (
                    <div key={cat.id} className="category-item">
                      {data.categories.length > 1 && (
                        <div className="category-title">
                          {`Category: ${cat.name}`}
                        </div>
                      )}
                      <ul className="tags-list">
                        {cat.tags && cat.tags.map((tag) => {
                          const userSub = subscriptions
                            ? subscriptions.find(sub => sub.tag.id === tag.id) : undefined;
                          let scopePreference = 'whole city';
                          if (userSub) {
                            scopePreference = userSub.whole_city
                              ? 'whole city' : userSub.radius_miles;
                          }
                          return (
                            <li key={tag.id} className="tag-item">
                              <div className="inline-selectors">
                                <input
                                  id={`input-${tag.name}`}
                                  type="checkbox"
                                  name={tagTranslation[tag.name]}
                                  value={tag.name}
                                  aria-labelledby={tag.name}
                                  checked={userSub !== undefined}
                                  onChange={e => this.handleBoxCheck(
                                    tag,
                                    e.target.checked,
                                    setUserPreference
                                  )}
                                />
                                <span className="inline-selectors">
                                  <label id={tag.name} htmlFor={`input-${tag.name}`}>
                                    {tagTranslation[tag.name]}
                                  </label>
                                </span>
                              </div>
                              <select
                                className="inline-selectors"
                                defaultValue={scopePreference}
                                disabled={userSub === undefined}
                                onChange={e => this.handleDropdownChange(
                                  tag,
                                  e.target.value,
                                  setUserPreference,
                                )}
                              >
                                {radiusMilesOpts.map(opt => (
                                  <option
                                    key={`${opt}-opt`}
                                    value={opt}
                                  >
                                    {(typeof opt === 'string') ? opt : `${opt} mile${opt === 1 ? '' : 's'}`}
                                  </option>
                                ))}
                              </select>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

Categories.propTypes = {
  userPreference: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    location_x: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    location_y: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    send_types: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      email: PropTypes.string,
    })),
    subscriptions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      radius_miles: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      whole_city: PropTypes.bool,
      tag: PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        name: PropTypes.string,
      }),
    })),
  }),
  email: PropTypes.string,
  onPrefSaved: PropTypes.func,
};

Categories.defaultProps = {
  userPreference: null,
  email: null,
  onPrefSaved: () => null,
};

export default Categories;
