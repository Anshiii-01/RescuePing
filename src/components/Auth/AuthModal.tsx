import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAuth, RegisterData } from '../../contexts/AuthContext';
import { X, Mail, Lock, User, Phone, Heart, AlertCircle, Check } from 'lucide-react';
import { buttonInteraction, inputInteraction, fadeInScale, slideInUp } from '../../styles/microinteractions';

// Animations
const modalBackdropFade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

// Styled Components
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  ${css`animation: ${modalBackdropFade} 0.3s ease-out;`}
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #0E1014 0%, #16181C 100%);
  border-radius: 24px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.52);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  ${css`animation: ${fadeInScale} 0.4s cubic-bezier(0.4, 0, 0.2, 1);`}
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const ModalHeader = styled.div`
  padding: 32px 32px 0 32px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #EF4444 0%, #F97316 50%, #EF4444 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  ${css`animation: ${slideInUp} 0.5s ease-out;`}
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  margin-bottom: 32px;
  ${css`animation: ${slideInUp} 0.6s ease-out;`}
`;

const Form = styled.form`
  padding: 0 32px 32px 32px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px;
  border-radius: 12px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${({ active, theme }) => active ? theme.colors.primary[500] : 'transparent'};
  color: ${({ active, theme }) => active ? '#FFFFFF' : theme.colors.text.secondary};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primary[600] : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
  ${css`animation: ${slideInUp} 0.7s ease-out;`}
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input<{ hasError?: boolean }>`
  ${inputInteraction}
  width: 100%;
  padding: 12px 12px 12px 40px;
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ hasError, theme }) => hasError ? theme.colors.danger[500] : theme.colors.border.default};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
  
  ${({ hasError }) => hasError && css`
    animation: ${shake} 0.5s ease;
  `}
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 8px;
  min-height: 44px;
  cursor: text;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  
  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const TagInputField = styled.input`
  flex: 1;
  min-width: 120px;
  background: none;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const Select = styled.select`
  ${inputInteraction}
  width: 100%;
  padding: 12px 12px 12px 40px;
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  cursor: pointer;
  
  option {
    background: ${({ theme }) => theme.colors.surface.default};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.danger[500]};
  font-size: 12px;
  margin-top: 6px;
  ${css`animation: ${slideInUp} 0.3s ease-out;`}
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const SubmitButton = styled.button`
  ${buttonInteraction}
  width: 100%;
  padding: 14px;
  background: ${({ theme }) => theme.colors.gradients.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  margin-top: 24px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.success[500]}20;
  border: 1px solid ${({ theme }) => theme.colors.success[500]};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.success[500]};
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
  ${css`animation: ${slideInUp} 0.4s ease-out;`}
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

// Component
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    blood_type: 'Unknown',
    allergies: [],
    medications: [],
    emergency_contact: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password);
        if (isMounted.current) {
          setSuccess(true);
          setTimeout(() => {
            if (isMounted.current) onClose();
          }, 1500);
        }
      } else {
        await register(formData);
        if (isMounted.current) {
          setSuccess(true);
          setTimeout(() => {
            if (isMounted.current) onClose();
          }, 1500);
        }
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError(err.message || 'An error occurred');
      }
    }
  };

  const addTag = (type: 'allergies' | 'medications', value: string) => {
    if (!value.trim()) return;
    const current = formData[type] || [];
    if (!current.includes(value.trim())) {
      setFormData({ ...formData, [type]: [...current, value.trim()] });
    }
    if (type === 'allergies') setAllergyInput('');
    if (type === 'medications') setMedicationInput('');
  };

  const removeTag = (type: 'allergies' | 'medications', value: string) => {
    const current = formData[type] || [];
    setFormData({ ...formData, [type]: current.filter(item => item !== value) });
  };

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
        
        <ModalHeader>
          <Title>Welcome to Rescue Ping</Title>
          <Subtitle>
            {activeTab === 'login' ? 'Sign in to access your profile' : 'Create your emergency profile'}
          </Subtitle>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <TabContainer>
            <Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')} type="button">
              Sign In
            </Tab>
            <Tab active={activeTab === 'register'} onClick={() => setActiveTab('register')} type="button">
              Register
            </Tab>
          </TabContainer>

          {/* Email */}
          <InputGroup>
            <Label>Email</Label>
            <InputWrapper>
              <Icon><Mail /></Icon>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                hasError={!!error}
              />
            </InputWrapper>
          </InputGroup>

          {/* Password */}
          <InputGroup>
            <Label>Password</Label>
            <InputWrapper>
              <Icon><Lock /></Icon>
              <Input
                type="password"
                placeholder={activeTab === 'login' ? 'Enter your password' : 'Min 8 chars, 1 uppercase, 1 digit'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                hasError={!!error}
              />
            </InputWrapper>
          </InputGroup>

          {/* Register-only fields */}
          {activeTab === 'register' && (
            <>
              <InputGroup>
                <Label>Full Name</Label>
                <InputWrapper>
                  <Icon><User /></Icon>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label>Phone (Optional)</Label>
                <InputWrapper>
                  <Icon><Phone /></Icon>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label>Blood Type</Label>
                <InputWrapper>
                  <Icon><Heart /></Icon>
                  <Select
                    value={formData.blood_type}
                    onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                  >
                    <option value="Unknown">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Select>
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label>Allergies (Optional)</Label>
                <TagInput>
                  {formData.allergies?.map((allergy) => (
                    <Tag key={allergy}>
                      {allergy}
                      <button type="button" onClick={() => removeTag('allergies', allergy)}>
                        <X size={12} />
                      </button>
                    </Tag>
                  ))}
                  <TagInputField
                    type="text"
                    placeholder="Type and press Enter"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('allergies', allergyInput);
                      }
                    }}
                  />
                </TagInput>
              </InputGroup>

              <InputGroup>
                <Label>Medications (Optional)</Label>
                <TagInput>
                  {formData.medications?.map((med) => (
                    <Tag key={med}>
                      {med}
                      <button type="button" onClick={() => removeTag('medications', med)}>
                        <X size={12} />
                      </button>
                    </Tag>
                  ))}
                  <TagInputField
                    type="text"
                    placeholder="Type and press Enter"
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('medications', medicationInput);
                      }
                    }}
                  />
                </TagInput>
              </InputGroup>
            </>
          )}

          {error && (
            <ErrorMessage>
              <AlertCircle />
              {error}
            </ErrorMessage>
          )}

          {success && (
            <SuccessMessage>
              <Check />
              {activeTab === 'login' ? 'Login successful!' : 'Registration successful!'}
            </SuccessMessage>
          )}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </SubmitButton>
        </Form>
      </Modal>
    </Backdrop>
  );
};

export default AuthModal;
