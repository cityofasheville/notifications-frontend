import React from 'react';
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
    this.setState({ subscriptions }, () => { setUserPreference(); this.props.onPrefSaved(); });
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
        { whole_city: false, radius_miles: selectedValue }
      );
    }
    subscriptions.splice(thisSubIndex, 1);
    subscriptions.push(newSub);
    this.setState({ subscriptions }, () => { setUserPreference(); this.props.onPrefSaved(); });
  }

  render() {
    const mutation = this.props.userPreference ? UPDATE_USER_PREFERENCE : CREATE_USER_PREFERENCE;
    const email = this.props.userPreference && this.props.userPreference.send_types ?
      this.props.userPreference.send_types.find(typeObj => typeObj.type === 'EMAIL').email :
      this.props.email;
    const newUserPref = stripTypeNameFromObj(Object.assign(
      this.props.userPreference || { send_types: { type: 'EMAIL', email }},
      { subscriptions: this.state.subscriptions }
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
                          const userSub = this.state.subscriptions ?
                            this.state.subscriptions.find(sub => sub.tag.id === tag.id) : undefined;
                          let userPreference = 'whole city';
                          if (userSub) {
                            userPreference = userSub.whole_city ?
                              'whole city' : userSub.radius_miles;
                          }
                          return (
                            <li key={tag.id} className="tag-item">
                              <input
                                type="checkbox"
                                name={tag.name}
                                value={tag.id}
                                checked={userSub !== undefined}
                                onChange={e => this.handleBoxCheck(
                                  tag,
                                  e.target.checked,
                                  setUserPreference
                                )}
                              />
                              <span>{tag.name}</span>
                              <select
                                defaultValue={userPreference}
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

export default Categories;
