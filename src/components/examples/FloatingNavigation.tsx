import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, MessageSquare, User, ArrowRight } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
}

interface FloatingNavigationProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  className?: string;
}

const FloatingNavigation = ({ currentSection, onNavigate, className = "" }: FloatingNavigationProps) => {
  const navItems: NavItem[] = [
    {
      id: 'demos',
      label: 'AI Systems',
      icon: <Users className="w-4 h-4" />,
      isActive: currentSection === 'demos',
      isCompleted: ['jordan', 'contact'].includes(currentSection)
    },
    {
      id: 'jordan',
      label: 'Client Delivery',
      icon: <User className="w-4 h-4" />,
      isActive: currentSection === 'jordan',
      isCompleted: currentSection === 'contact'
    },
    {
      id: 'contact',
      label: 'Get Started',
      icon: <MessageSquare className="w-4 h-4" />,
      isActive: currentSection === 'contact',
      isCompleted: false
    }
  ];

  return (
    <Card className={`
      fixed right-4 top-1/2 -translate-y-1/2 z-50 p-2 shadow-lg border-galavanteer-purple/20
      hidden lg:block bg-white/95 backdrop-blur-sm
      ${className}
    `}>
      <div className="flex flex-col gap-1">
        {navItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <button
              onClick={() => onNavigate(item.id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-300
                ${item.isActive 
                  ? 'bg-galavanteer-purple text-white shadow-md' 
                  : item.isCompleted
                    ? 'bg-galavanteer-purple-light/50 text-galavanteer-purple hover:bg-galavanteer-purple hover:text-white'
                    : 'text-galavanteer-gray/70 hover:bg-galavanteer-purple-light/30 hover:text-galavanteer-purple'
                }
              `}
            >
              <div className={`
                flex items-center justify-center w-6 h-6 rounded-full
                ${item.isActive 
                  ? 'bg-white/20' 
                  : item.isCompleted
                    ? 'bg-galavanteer-purple/20'
                    : 'bg-galavanteer-gray-light'
                }
              `}>
                {item.icon}
              </div>
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
            
            {/* Connection line */}
            {index < navItems.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowRight className={`
                  w-3 h-3 
                  ${item.isCompleted 
                    ? 'text-galavanteer-purple' 
                    : 'text-galavanteer-gray/30'
                  }
                `} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

export default FloatingNavigation;