import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import queryString from 'query-string';
import {
  Layer,
  Pane,
  PaneMenu,
  Row,
  Col,
  Accordion,
  ExpandAllButton,
  KeyValue,
  Headline,
  IconButton,
  AppIcon,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { craftLayerUrl } from './utils';
import HoldingsForm from './edit/holdings/HoldingsForm';

class ViewHoldingsRecord extends React.Component {
  static manifest = Object.freeze({
    query: {},
    permanentLocationQuery: {},
    temporaryLocationQuery: {},
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
      POST: {
        path: 'holdings-storage/holdings',
      },
    },
    instances1: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
    },
    permanentLocation: {
      type: 'okapi',
      path: 'locations/%{permanentLocationQuery.id}',
    },
    temporaryLocation: {
      type: 'okapi',
      path: 'locations/%{temporaryLocationQuery.id}',
    },

    platforms: {
      type: 'okapi',
      path: 'platforms',
      records: 'platforms',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        accordion01: true,
        accordion02: true,
        accordion03: true,
        accordion04: true,
        accordion05: true,
        accordion06: true,
        accordion07: true,
      },
    };
    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  static getDerivedStateFromProps(nextProps) {
    const { resources } = nextProps;
    const holdingsRecords = (resources.holdingsRecords || {}).records || [];
    const permanentLocationQuery = resources.permanentLocationQuery;
    const temporaryLocationQuery = resources.temporaryLocationQuery;
    const holding = holdingsRecords[0];

    if (holding && holding.permanentLocationId
      && (!permanentLocationQuery.id || permanentLocationQuery.id !== holding.permanentLocationId)) {
      nextProps.mutator.permanentLocationQuery.update({ id: holding.permanentLocationId });
    }
    if (holding && holding.temporaryLocationId
      && (!temporaryLocationQuery.id || temporaryLocationQuery.id !== holding.temporaryLocationId)) {
      nextProps.mutator.temporaryLocationQuery.update({ id: holding.temporaryLocationId });
    }

    return null;
  }

  // Edit Holdings records handlers
  onClickEditHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: 'editHoldingsRecord' });
  }

  onClickCloseEditHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: null });
  }

  updateHoldingsRecord = (holdingsRecord) => {
    const holdings = holdingsRecord;
    if (holdings.permanentLocationId === '') delete holdings.permanentLocationId;
    if (holdings.platformId === '') delete holdings.platformId;
    this.props.mutator.holdingsRecords.PUT(holdings).then(() => {
      this.onClickCloseEditHoldingsRecord();
    });
  }

  copyHoldingsRecord = (holdingsRecord) => {
    const { resources: { instances1 } } = this.props;
    const instance = instances1.records[0];

    this.props.mutator.holdingsRecords.POST(holdingsRecord).then((data) => {
      this.props.mutator.query.update({
        _path: `/inventory/view/${instance.id}/${data.id}`,
        layer: null,
      });
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
  }

  onCopy(record) {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.copiedRecord = _.omit(record, ['id']);
      return newState;
    });

    this.props.mutator.query.update({ layer: 'copyHoldingsRecord' });
  }

  render() {
    const { location, resources: { holdingsRecords, instances1, platforms, permanentLocation, temporaryLocation }, referenceTables, okapi } = this.props;

    if (!holdingsRecords || !holdingsRecords.hasLoaded) return <div>Awaiting resources</div>;

    const holdingsRecord = holdingsRecords.records[0];

    if (!instances1 || !instances1.hasLoaded
        || (holdingsRecord.permanentLocationId && (!permanentLocation || !permanentLocation.hasLoaded))
        || (holdingsRecord.temporaryLocationId && (!temporaryLocation || !temporaryLocation.hasLoaded))
        || !platforms || !platforms.hasLoaded) return <div>Awaiting resources</div>;

    const instance = instances1.records[0];
    const holdingsPermanentLocation = holdingsRecord.permanentLocationId ? permanentLocation.records[0] : null;
    const holdingsTemporaryLocation = holdingsRecord.temporaryLocationId ? temporaryLocation.records[0] : null;

    referenceTables.platforms = platforms.records;

    const query = location.search ? queryString.parse(location.search) : {};
    const that = this;
    const formatMsg = this.props.stripes.intl.formatMessage;

    const detailMenu = (
      <PaneMenu>
        <IconButton
          icon="edit"
          id="clickable-edit-holdingsrecord"
          style={{ visibility: !holdingsRecord ? 'hidden' : 'visible' }}
          href={this.craftLayerUrl('editHoldingsRecord')}
          onClick={this.onClickEditHoldingsRecord}
          title={formatMsg({ id: 'ui-inventory.editHoldings' })}
        />
      </PaneMenu>
    );

    return (
      <div>
        <Layer isOpen label={formatMsg({ id: 'ui-inventory.viewHoldingsRecord' })}>
          <Pane
            defaultWidth={this.props.paneWidth}
            paneTitle={
              <div style={{ textAlign: 'center' }}>
                <AppIcon app="inventory" iconKey="holdings" size="small" />
                <strong>
                  {holdingsRecord.permanentLocationId ? `${holdingsPermanentLocation.name} >` : null}
                  {' '}
                  {_.get(holdingsRecord, ['callNumber'], '')}
                </strong>
&nbsp;
                <div>
                  {formatMsg({ id: 'ui-inventory.holdings' })}
                </div>
              </div>
            }
            lastMenu={detailMenu}
            dismissible
            onClose={this.props.onCloseViewHoldingsRecord}
            actionMenuItems={[{
              label: formatMsg({ id: 'ui-inventory.editHoldings' }),
              href: this.craftLayerUrl('editHoldingsRecord'),
              onClick: this.onClickEditHoldingsRecord,
            }, {
              id: 'clickable-copy-holdingsrecord',
              onClick: () => this.onCopy(holdingsRecord),
              label: formatMsg({ id: 'ui-inventory.copyHolding' })
            }]}
          >
            <Row center="xs">
              <Col sm={6}>
                {formatMsg({ id: 'ui-inventory.instance' })}
                {' '}
                {instance.title}
                {(instance.publication && instance.publication.length > 0) &&
                <span>
                  <em>, </em>
                  <em>
                    {instance.publication[0].publisher}
                    {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                  </em>
                </span>
                }
              </Col>
            </Row>
            <hr />
            <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} /></Col></Row>
            <Accordion
              open={this.state.accordions.accordion01}
              id="accordion01"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.administrativeData' })}
            >
              { (holdingsRecord.metadata && holdingsRecord.metadata.createdDate) &&
              <this.cViewMetaData metadata={holdingsRecord.metadata} />
              }
              <Row>
                <Col sm={12}>
                  <AppIcon app="inventory" iconKey="holdings" size="small" />
                  {' '}
                  {formatMsg({ id: 'ui-inventory.holdingsRecord' })}
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Headline size="small" margin="small">
                    {holdingsRecord.permanentLocationId ? holdingsPermanentLocation.name : null}
                    {' '}
&gt;
                    {_.get(holdingsRecord, ['callNumber'], '')}
                  </Headline>
                </Col>
              </Row>
              <Row>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.holdingsHrid' })} value={_.get(holdingsRecord, ['id'], '')} />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion02}
              id="accordion02"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.locations' })}
            >
              <Row>
                <Col smOffset={0} sm={4}>
                  <strong>{formatMsg({ id: 'ui-inventory.holdingsLocation' })}</strong>
                </Col>
              </Row>
              <br />
              { ((holdingsRecord.permanentLocationId) || (holdingsRecord.temporaryLocationId)) &&
                <Row>
                  <Col smOffset={0} sm={4}>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.permanent' })} value={holdingsPermanentLocation.name} />
                  </Col>
                  <Col>
                    <KeyValue label={formatMsg({ id: 'ui-inventory.temporary' })} value={holdingsTemporaryLocation ? holdingsTemporaryLocation.name : '-'} />
                  </Col>
                </Row>

              }
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion03}
              id="accordion03"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.holdingsDetails' })}
            >
              { (holdingsRecord.holdingsStatements.length > 0) &&
              <Row>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.holdingsStatements' })} value={_.get(holdingsRecord, ['holdingsStatements'], []).map((line, i) => <div key={i}>{line}</div>)} />
                </Col>
              </Row>
              }
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion04}
              id="accordion04"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.notes' })}
            />
            <Accordion
              open={this.state.accordions.accordion05}
              id="accordion05"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.acquisitions' })}
            />
            <Accordion
              open={this.state.accordions.accordion06}
              id="accordion06"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.electronicAccess' })}
            >
              { (holdingsRecord.electronicLocation && holdingsRecord.electronicLocation.uri) &&
              <Row>
                <Col smOffset={0} sm={4}>
                  <KeyValue label={formatMsg({ id: 'ui-inventory.uri' })} value={_.get(holdingsRecord, ['electronicLocation', 'uri'], '')} />
                </Col>
              </Row>
              }
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion07}
              id="accordion07"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.receivingHistory' })}
            />
          </Pane>
        </Layer>
        <Layer isOpen={query.layer ? (query.layer === 'editHoldingsRecord') : false} label={formatMsg({ id: 'ui-inventory.editHoldingsRecordDialog' })}>
          <HoldingsForm
            initialValues={holdingsRecord}
            onSubmit={(record) => { that.updateHoldingsRecord(record); }}
            onCancel={this.onClickCloseEditHoldingsRecord}
            okapi={okapi}
            formatMsg={formatMsg}
            instance={instance}
            referenceTables={referenceTables}
            stripes={this.props.stripes}
          />
        </Layer>
        <Layer isOpen={query.layer ? (query.layer === 'copyHoldingsRecord') : false} label={formatMsg({ id: 'ui-inventory.copyHoldingsRecordDialog' })}>
          <HoldingsForm
            initialValues={this.state.copiedRecord}
            onSubmit={(record) => { that.copyHoldingsRecord(record); }}
            onCancel={this.onClickCloseEditHoldingsRecord}
            okapi={okapi}
            formatMsg={formatMsg}
            instance={instance}
            copy
            referenceTables={referenceTables}
            stripes={this.props.stripes}
          />
        </Layer>
      </div>
    );
  }
}

ViewHoldingsRecord.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  }).isRequired,
  resources: PropTypes.shape({
    instances1: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    locations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    permanentLocation: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    temporaryLocation: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    platforms: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  okapi: PropTypes.object,
  location: PropTypes.object,
  paneWidth: PropTypes.string,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    holdingsRecords: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
    permanentLocationQuery: PropTypes.object.isRequired,
    temporaryLocationQuery: PropTypes.object.isRequired,
  }),
  onCloseViewHoldingsRecord: PropTypes.func.isRequired,
};


export default ViewHoldingsRecord;