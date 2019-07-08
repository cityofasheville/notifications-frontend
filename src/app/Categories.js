import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { CREATE_USER_PREFERENCE, UPDATE_USER_PREFERENCE } from 'app/mutations';
import { CATEGORIES_QUERY, GET_USER_PREFERENCES } from 'app/queries';
import { omitTypeName } from 'app/utils';
import 'app/styles/components/Categories.scss';


const radiusMilesOpts = [
  0.25,
  0.5,
  1,
  2,
  3,
  'whole city',
]

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptions: props.userPreference.subscriptions || [],
    }
    this.handleBoxCheck = this.handleBoxCheck.bind(this);
  }


  handleBoxCheck(tagId, checked, setUserPref) {
    const subscriptions = [].concat(this.state.subscriptions);
    if (checked) {
      subscriptions.push({ tag: { id: tagId }, whole_city: true });
    } else {
      const thisSubIndex = subscriptions.indexOf(d => d.tag.id === tagId)
      subscriptions.splice(thisSubIndex, 1);
    }
console.log(subscriptions)
    this.setState(
      {
        subscriptions,
      }
    )
    setUserPref();
  }

  handleDropdownChange(tagId, setUserPref) {

  }

  render() {
    const mutation = this.props.userPreference ? UPDATE_USER_PREFERENCE : CREATE_USER_PREFERENCE;
    return <Query
      query={CATEGORIES_QUERY}
      fetchPolicy="network-only"
    >
      { ({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div className="alert-danger">Sorry, there was an error.</div>;
        console.log(this.props.userPreference, this.props.userPreference.subscriptions, this.state.subscriptions)
        return (
          <Mutation
            mutation={mutation}
            variables={{
              user_preference: {
                subscriptions: this.state.subscriptions,
              },
            }}
            refetchQueries={[
              // TODO: we shouldn't need this if we set up the updates properly, include IDs
              {
                query: GET_USER_PREFERENCES,
                variables: {
                  email: this.props.userPreference ? this.props.userPreference.send_types.find(typeObj => typeObj.type === 'EMAIL').email : this.props.email,
                },
              },
            ]}
          >
            {setUserPref => (
              <div className="categories-list">
                {data.categories.map(cat => (
                  <div key={cat.id} className="category-item">
                    {data.categories.length > 1 && <div className="category-title">Category: {cat.name}</div>}
                    <ul className="tags-list">
                      {cat.tags && cat.tags.map(tag => {
console.log(this.state.subscriptions, tag)
                        const userSub = this.state.subscriptions ?
                          this.state.subscriptions.find(sub => sub.tag.id === tag.id) : undefined;
                        let userPreference = 'whole city';
                        if (userSub) {
                          userPreference = userSub.whole_city ? 'whole city' : userSub.radius_miles;
                        }

                        return (<li key={tag.id} className="tag-item">
                          <input
                            type="checkbox"
                            name={tag.name}
                            value={tag.id}
                            checked={userSub !== undefined}
                            onChange={(e) => this.handleBoxCheck(
                              tag.id,
                              e.target.checked,
                              setUserPref
                            )}
                          />
                          <span>{tag.name}</span>
                          <select defaultValue={userPreference} disabled={userSub === undefined}>
                            {radiusMilesOpts.map(opt => (
                              <option
                                key={`${opt}-opt`}
                                value={opt}
                              >
                                {isNaN(opt) ? opt : `${opt} mile${opt % 1 === 0 ? '' : 's'}`}
                              </option>
                            ))}
                          </select>
                        </li>);
                      })}
                    </ul>
                  </div>
                ))
              }
            </div>
            )}
          </Mutation>
        )
      }}
    </Query>
  }
        // </Mutation>
}

export default Categories;
