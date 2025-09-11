import { FC } from 'react';

interface ContactProfileProps {
  contactId: string;
  onClose: () => void;
}

const ContactProfile: FC<ContactProfileProps> = ({ contactId, onClose }) => {
  console.log(contactId, onClose);
  return <div>ContactProfile</div>;
};

export default ContactProfile;
