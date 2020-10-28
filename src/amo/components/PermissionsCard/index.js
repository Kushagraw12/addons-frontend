/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import translate from 'core/i18n/translate';
import Button from 'ui/components/Button';
import ShowMoreCard from 'ui/components/ShowMoreCard';
import type { AppState } from 'amo/store';
import type { AddonVersionType } from 'core/reducers/versions';
import type { UserAgentInfoType } from 'core/reducers/api';
import type { I18nType } from 'core/types/i18n';

import { PermissionUtils } from './permissions';

import './styles.scss';

type Props = {|
  version: AddonVersionType | null,
  i18n: I18nType,
  userAgentInfo: UserAgentInfoType,
|};

export class PermissionsCardBase extends React.Component<Props> {
  render() {
    const { version, i18n, userAgentInfo } = this.props;

    if (!version) {
      return null;
    }

    const permissionUtils = new PermissionUtils(i18n);

    const addonPermissions = permissionUtils.getCurrentPermissions({
      platformFiles: version.platformFiles,
      userAgentInfo,
    });

    if (
      !addonPermissions.optional.length &&
      !addonPermissions.required.length
    ) {
      return null;
    }

    const optionalContent = permissionUtils.formatPermissions(
      addonPermissions.optional,
    );
    const requiredContent = permissionUtils.formatPermissions(
      addonPermissions.required,
    );

    if (!optionalContent.length && !requiredContent.length) {
      return null;
    }

    return (
      <ShowMoreCard
        header={<p>
          {i18n.gettext('Permissions')}
          <a className="PermissionCard-learn-more" href="https://support.mozilla.org/kb/permission-request-messages-firefox-extensions">
            {i18n.gettext('Learn more')}
            <span> </span>
            <img src='https://user-images.githubusercontent.com/142755/95220537-9170b800-07c4-11eb-896c-87cce673a57a.png'
              height='21'
              width='21' />
          </a>
        </p> 
      }
        className="PermissionsCard"
        id="AddonDescription-permissions-card"
        maxHeight={300}
      >
        {requiredContent.length ? (
          <>
            <p className="PermissionsCard-subhead--required">
              {i18n.gettext('This add-on needs to:')}
            </p>
            <ul className="PermissionsCard-list--required">
              {requiredContent}
            </ul>
          </>
        ) : null}
        {optionalContent.length ? (
          <>
            <p className="PermissionsCard-subhead--optional">
              {i18n.gettext('This add-on may also ask to:')}
            </p>
            <ul className="PermissionsCard-list--optional">
              {optionalContent}
            </ul>
          </>
        ) : null}
       {/*<Button
          buttonType="neutral"
          className="PermissionCard-learn-more"
          href="https://support.mozilla.org/kb/permission-request-messages-firefox-extensions"
          target="_blank"
          externalDark
          puffy
        >
          {i18n.gettext('Learn more about permissions')}
       </Button>*/}
      </ShowMoreCard>
    );
  }
}

export const mapStateToProps = (state: AppState) => {
  return {
    userAgentInfo: state.api.userAgentInfo,
  };
};

const PermissionsCard: React.ComponentType<Props> = compose(
  connect(mapStateToProps),
  translate(),
)(PermissionsCardBase);

export default PermissionsCard;
