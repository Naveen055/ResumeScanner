import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, Info } from 'lucide-react';
import { KeywordMatcher } from '@/lib/keyword-matcher';

interface JobRoleInputProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

const keywordMatcher = new KeywordMatcher();

export function JobRoleInput({ selectedRole, onRoleChange, disabled }: JobRoleInputProps) {
  const jobRoles = keywordMatcher.getAllJobRoles();

  return (
    <Card className="card-enhanced card-hover">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3">
            <Briefcase className="text-primary-foreground" size={14} />
          </div>
          Target Job Role
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="jobRole" className="text-sm font-semibold text-foreground mb-2 block">
              Select your target job role
            </Label>
            <Select 
              value={selectedRole} 
              onValueChange={onRoleChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-12 mt-2 bg-background border-2 border-border hover:border-primary/50 focus:border-primary transition-colors rounded-xl">
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                {jobRoles.map((role) => (
                  <SelectItem 
                    key={role.id} 
                    value={role.id}
                    className="hover:bg-primary/5 focus:bg-primary/5 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium">{role.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Alert className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
            <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
              <Info className="h-3 w-3 text-primary" />
            </div>
            <AlertDescription className="text-sm text-muted-foreground leading-relaxed">
              Select the role you're applying for to get personalized keyword suggestions and scoring 
              based on industry standards and ATS requirements.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
