import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import 'app/styles/components/Categories.scss';

const CATEGORIES_QUERY = gql`
  query categories {
    categories {
      name
      id
      tags {
        id
        name
      }
    }
  }
`;


// TODO: also wrap map in same mutation? wrap entire 2 and 3 in mutation?
const CREATE_USER_PREFERENCE = gql`
  mutation createUserPreference(
    $location_x: Float!,
    $location_y: Float!,
    $send_types: [SendType],
    $subscriptions: [Subscription],

  ) {
    user_preference(
      location_x: $location_x,
      location_y: $location_y,
      send_types: $send_types,
      subscriptions: $subscriptions,
    ) {
      location_x
      location_y
      send_types {
        email
      }
      subscriptions {
        tag_id
        radius_miles
        whole_city
      }
    }
  }
`;

const radiusMilesOpts = [
  0.25,
  0.5,
  1,
  2,
  3,
  'whole city',
]

class Categories extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <Query
      query={CATEGORIES_QUERY}
      fetchPolicy="network-only"
    >
      { ({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div className="alert-danger">Sorry, there was an error.</div>;

        return (
          <div className="categories-list">
            {data.categories.map(cat => (
              <div key={cat.id} className="category-item">
                {data.categories.length > 1 && <div className="category-title">Category: {cat.name}</div>}
                <ul className="tags-list">
                  {cat.tags && cat.tags.map(tag => {
                    const userSub = this.props.userSubscriptions ? this.props.userSubscriptions.find(sub => sub.tag.id === tag.id) : undefined;
                    let userPreference = 'whole city';
                    if (userSub) {
                      userPreference = userSub.whole_city ? 'whole city' : userSub.radius_miles;
                    }

                    return (<li key={tag.id} className="tag-item">
                      <input type="checkbox" name={tag.name} value={tag.id}/>
                      <span>{tag.name}</span>
                      <select defaultValue={userPreference}>
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
        </div>)
      }}
    </Query>
  }
}

export default Categories;
