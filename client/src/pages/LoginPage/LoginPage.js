import './LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LogInDisplay from '../../components/AuthDisplays/Log_in_display/Log_in_display';

function LoginPage() {
  return (
    <div className="login_page">
      <LogInDisplay />
    </div>
  );
}

export default LoginPage;
