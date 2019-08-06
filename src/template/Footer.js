/* **********************************************************************************************
  WARNING: DO NOT EDIT this file except from inside the react-starter-template repository. Changes made to this file inside child repos will NOT be reflected in the parent source template repository, and will generate code conflicts.
*********************************************************************************************** */
import React from 'react';
import config from 'app/config';
// import { IM_GITHUB } from 'template/assets/iconConstants';
// import Icon from 'template/shared/Icon';
import 'template/styles/components/Footer.css';

const Footer = () => (
  <div>
    <div className="clear-footer"></div>
    <footer className="footer">
      <div className="container">
        <div className="col-sm-12">
          {config.hasFeedbackForm && config.useFeedbackForErrors
            && (
              <div>
                We strive for full accessibility. Report issues with our&nbsp;
                <a
                  className="inText"
                  href={config.feedbackURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="website feedback form"
                >
                  feedback form
                </a>
                .
              </div>
            )
          }
          {(!config.hasFeedbackForm || !config.useFeedbackForErrors) && (
            <div>
              We strive for full accessibility. Report issues to <a href={`mailto:help@ashevillenc.gov?subject=${config.appTitle.defaultText}`} target="_blank" rel="noopener noreferrer">help@ashevillenc.gov</a>.
            </div>
          )}
          <div>
            Visit&nbsp;
            <a
              href="https://ashevillenc.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              AshevilleNC.gov&nbsp;
            </a>
            for other city services and information.
          </div>
          {/*{config.hasGitHubURL
            && (
              <div>
                It&apos;s open source! Fork it on&nbsp;
                <a
                  href={config.gitHubURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <span style={{ marginLeft: '5px' }}>
                    <Icon
                      path={IM_GITHUB}
                      size={19}
                      verticalAlign="bottom"
                    />
                  </span>
                </a>
              </div>
            )
          }*/}
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
