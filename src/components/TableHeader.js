import React from 'react';
import { Button, Icon, Popup, Menu } from 'semantic-ui-react'


const concatButtons = (defaults, extra) => {
  const removeDuplicateDefaults = (d) => ! extra.map(e => e.iconName).includes(d.iconName);
  return defaults
          .filter(removeDuplicateDefaults)
          .concat(extra)
}

export const TableHeader = ({actionButtons, tableState, tableDispatch, extra, refresh}) => {
  return (
    <Menu secondary style={{margin: 0, padding: "0,0"}}>
        <Menu.Item style={{margin: 0, padding: "0"}}>
          <Button.Group>
            {
              (extra ? concatButtons(actionButtons, extra.actionButtons || []) : actionButtons).map(
                (b) => (
                  <Popup
                    content={b.message}
                    key={b.key}
                    trigger={
                      <Button icon basic size='large' onClick={() => b.onClick(tableState, tableDispatch)}>
                        <Icon name={b.iconName}/>
                      </Button>
                    }
                  />
                )
              )
            }
          </Button.Group>
        </Menu.Item>
        <Menu.Menu position='right'>
            <Menu.Item as='a' header>
                <Popup
                    content='Refresh Page'
                    trigger={
                        <Icon
                            name='refresh'
                            onClick={refresh}
                        />
                    }
                    position='bottom right'
                />
            </Menu.Item>
        </Menu.Menu>
    </Menu>

  )
}