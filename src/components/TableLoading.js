
import React from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react'


export const TableLoading = () => {
    return (
        <Segment style={{"height": "700px"}}>
            <Dimmer active>
                <Loader size='massive'>Loading report</Loader>
            </Dimmer>
        </Segment>
    )
}