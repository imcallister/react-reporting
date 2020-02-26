import React from 'react';
import { Button, Dropdown, Icon, Label, Input, Grid, Menu } from 'semantic-ui-react'



export const PaginationControl = ({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageCount,
  pageSize,
  pageOptions,
  setPageSize }) => {
    return (
      <Menu borderless>
        <Menu.Item onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <Icon name='angle double left'/>
        </Menu.Item>
        <Menu.Item onClick={() => previousPage()} disabled={!canPreviousPage}>
        <Icon name='angle left'/>
        </Menu.Item>
        <Menu.Item onClick={() => nextPage()} disabled={!canNextPage}>
          <Icon name='angle right'/>
        </Menu.Item>
        <Menu.Item onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <Icon name='angle double right'/>
        </Menu.Item>
        <Menu.Item>
            <Icon name='file outline' />
            {pageIndex + 1} of {pageOptions.length}
        </Menu.Item>
        <Menu.Item>
          <Input
            type="number"
            label="Go to page"
            size="small"
            style={{width: '50px'}}
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
          />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
              Rows per page
          </Menu.Item>
          <Menu.Item>
              <Dropdown
                value={pageSize}

                style={{width: '50px'}}
                onChange={(e, {value}) => {
                  setPageSize(Number(value))
                }}
                options={[10, 20, 30, 40, 50].map(n => ({key: 'option' + n, text: n, value: n}))}
              />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )

}