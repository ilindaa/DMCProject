import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function AlertDismissible(props) {
    const [show, setShow] = useState(true);
    const [variant/*, setVariant*/] = useState(props.variant);
    const [message/*, setMessage*/] = useState(props.message);

    /* Not sure if I'll use this */
/*    const updateAlert = (newVariant: string, newMessage: string) => {
        setVariant(newVariant);
        setMessage(newMessage);
    }*/

    if (show) {
        return (<>
            <Alert variant={variant} onClose={() => setShow(false)} id="alertNotif" dismissible>
                <p id="pMsg">
                    {message}
                </p>
            </Alert>
        </>);
    }
}

export default AlertDismissible;