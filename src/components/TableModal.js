import React from 'react';

import { Modal } from 'semantic-ui-react'


export const TableModal = ({modalOpen, setModalOpen, url}) => {
    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeIcon
        >
            <Modal.Content style={{height:"700px", padding: 0}}>
                <iframe src={url} width="100%" height="100%"></iframe>
            </Modal.Content>
        </Modal>
    )
}