import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SafetyCircle, SafetyStatus, CheckInReminder } from '../types/safetyCircle';
import SafetyCircleCard from '../components/Safety/SafetyCircleCard';
import SafetyCircleMemberCard from '../components/Safety/SafetyCircleMemberCard';
import CreateCircleForm from '../components/Safety/CreateCircleForm';
import LocationSharingToggle from '../components/Safety/LocationSharingToggle';
import CheckInReminderSettings from '../components/Safety/CheckInReminderSettings';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.primary};
`;

const PageHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradients.headingRed};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  max-width: 800px;
`;

const TabBar = styled.div`
  max-width: 1200px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.surface.border};
  overflow-x: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: none;
  color: ${({ theme, isActive }) =>
        isActive ? theme.colors.primary[500] : theme.colors.text.secondary
    };
  font-weight: ${({ theme, isActive }) =>
        isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal
    };
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  border-bottom: 3px solid ${({ theme, isActive }) =>
        isActive ? theme.colors.primary[500] : 'transparent'
    };
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.smooth};
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CirclesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const MembersContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const MembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const MembersTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const BackButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.smooth};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.surface.hover};
  }
`;

const MembersList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  .title {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  .description {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const CreateButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.smooth};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    box-shadow: ${({ theme }) => theme.shadows.glowRed};
  }
`;

const STORAGE_KEY = 'rescue-ping-safety-circles';

const SafetyNetworkPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'circles' | 'create' | 'settings'>('circles');
    const [circles, setCircles] = useState<SafetyCircle[]>([]);
    const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
    const [locationSharingEnabled, setLocationSharingEnabled] = useState(false);

    // Load circles from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setCircles(parsed);
            } catch (error) {
                console.error('Failed to load safety circles:', error);
            }
        }
    }, []);

    // Save circles to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(circles));
    }, [circles]);

    const handleCreateCircle = (circleData: Omit<SafetyCircle, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newCircle: SafetyCircle = {
            ...circleData,
            id: `circle-${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        setCircles([...circles, newCircle]);
        setActiveTab('circles');
    };

    const handleDeleteCircle = (circleId: string) => {
        if (window.confirm('Are you sure you want to delete this safety circle?')) {
            setCircles(circles.filter(c => c.id !== circleId));
            if (selectedCircleId === circleId) {
                setSelectedCircleId(null);
            }
        }
    };

    const handleCheckIn = (circleId: string) => {
        // Update current user's status to "safe" in this circle
        setCircles(circles.map(circle => {
            if (circle.id === circleId) {
                return {
                    ...circle,
                    members: circle.members.map(member => {
                        // In production, check if member is current user
                        if (member.id === circle.members[0]?.id) {
                            return {
                                ...member,
                                status: 'safe' as SafetyStatus,
                                lastCheckIn: Date.now()
                            };
                        }
                        return member;
                    }),
                    updatedAt: Date.now()
                };
            }
            return circle;
        }));

        alert('✅ Check-in successful! Your status has been updated to Safe.');
    };

    const handleUpdateMemberStatus = (circleId: string, memberId: string, status: SafetyStatus) => {
        setCircles(circles.map(circle => {
            if (circle.id === circleId) {
                return {
                    ...circle,
                    members: circle.members.map(member => {
                        if (member.id === memberId) {
                            return {
                                ...member,
                                status,
                                lastCheckIn: Date.now()
                            };
                        }
                        return member;
                    }),
                    updatedAt: Date.now()
                };
            }
            return circle;
        }));
    };

    const handleCall = (phone: string) => {
        window.open(`tel:${phone}`, '_self');
    };

    const handleViewLocation = (location: { latitude: number; longitude: number }) => {
        const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        window.open(url, '_blank');
    };

    const handleToggleLocationSharing = (enabled: boolean) => {
        setLocationSharingEnabled(enabled);
        // In production, update all circles with location sharing status
        setCircles(circles.map(circle => ({
            ...circle,
            locationSharingEnabled: enabled,
            updatedAt: Date.now()
        })));
    };

    const handleUpdateReminder = (reminder: CheckInReminder) => {
        setCircles(circles.map(circle => {
            if (circle.id === reminder.circleId) {
                return {
                    ...circle,
                    checkInReminders: circle.checkInReminders.map(r =>
                        r.id === reminder.id ? reminder : r
                    ),
                    updatedAt: Date.now()
                };
            }
            return circle;
        }));
    };

    const handleCreateReminder = (circleId: string, frequency: CheckInReminder['frequency']) => {
        const newReminder: CheckInReminder = {
            id: `reminder-${Date.now()}`,
            circleId,
            frequency,
            enabled: true,
            nextReminder: Date.now() + 60 * 60 * 1000 // 1 hour from now
        };

        setCircles(circles.map(circle => {
            if (circle.id === circleId) {
                return {
                    ...circle,
                    checkInReminders: [...circle.checkInReminders, newReminder],
                    updatedAt: Date.now()
                };
            }
            return circle;
        }));
    };

    const selectedCircle = circles.find(c => c.id === selectedCircleId);
    const allReminders = circles.flatMap(c => c.checkInReminders);

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>👥 Family Safety Network</PageTitle>
                <PageDescription>
                    Create safety circles, share locations, and coordinate with family and friends during emergencies
                </PageDescription>
            </PageHeader>

            <TabBar>
                <Tab isActive={activeTab === 'circles'} onClick={() => setActiveTab('circles')}>
                    🏠 My Circles
                </Tab>
                <Tab isActive={activeTab === 'create'} onClick={() => setActiveTab('create')}>
                    ➕ Create Circle
                </Tab>
                <Tab isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
                    ⚙️ Settings
                </Tab>
            </TabBar>

            <ContentContainer>
                {activeTab === 'circles' && (
                    <>
                        {selectedCircleId && selectedCircle ? (
                            <MembersContainer>
                                <MembersHeader>
                                    <MembersTitle>👥 {selectedCircle.name} - Members</MembersTitle>
                                    <BackButton onClick={() => setSelectedCircleId(null)}>
                                        ← Back to Circles
                                    </BackButton>
                                </MembersHeader>
                                <MembersList>
                                    {selectedCircle.members.map(member => (
                                        <SafetyCircleMemberCard
                                            key={member.id}
                                            member={member}
                                            onUpdateStatus={(memberId, status) =>
                                                handleUpdateMemberStatus(selectedCircle.id, memberId, status)
                                            }
                                            onCall={handleCall}
                                            onViewLocation={handleViewLocation}
                                        />
                                    ))}
                                </MembersList>
                            </MembersContainer>
                        ) : circles.length > 0 ? (
                            <CirclesGrid>
                                {circles.map(circle => (
                                    <SafetyCircleCard
                                        key={circle.id}
                                        circle={circle}
                                        onViewMembers={setSelectedCircleId}
                                        onCheckIn={handleCheckIn}
                                        onDelete={handleDeleteCircle}
                                    />
                                ))}
                            </CirclesGrid>
                        ) : (
                            <EmptyState>
                                <div className="icon">👥</div>
                                <div className="title">No Safety Circles Yet</div>
                                <div className="description">
                                    Create your first safety circle to start coordinating with family and friends during emergencies
                                </div>
                                <CreateButton onClick={() => setActiveTab('create')}>
                                    ➕ Create Your First Circle
                                </CreateButton>
                            </EmptyState>
                        )}
                    </>
                )}

                {activeTab === 'create' && (
                    <CreateCircleForm
                        onCreateCircle={handleCreateCircle}
                        onCancel={() => setActiveTab('circles')}
                    />
                )}

                {activeTab === 'settings' && (
                    <>
                        <LocationSharingToggle
                            enabled={locationSharingEnabled}
                            onToggle={handleToggleLocationSharing}
                        />
                        <div style={{ marginTop: '24px' }}>
                            <CheckInReminderSettings
                                reminders={allReminders}
                                onUpdateReminder={handleUpdateReminder}
                                onCreateReminder={handleCreateReminder}
                                circleIds={circles.map(c => c.id)}
                            />
                        </div>
                    </>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default SafetyNetworkPage;
