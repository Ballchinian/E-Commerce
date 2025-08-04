import './RegisterPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import RegisterDisplay from '../../components/AuthDisplays/Register_display/Register_display';

function RegisterPage() {
  return (
    <div className="register_page">
      <RegisterDisplay />
    </div>
  );
}

export default RegisterPage;
