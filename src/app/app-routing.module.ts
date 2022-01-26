import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetTheTeamComponent } from "./view/visitor/meet-the-team/meet-the-team.component";
import { ContactComponent } from "./view/visitor/contact/contact.component";
import { SignUpComponent } from "./view/visitor/sign-up/sign-up.component";
import { LoginComponent } from "./view/visitor/login/login.component";
import { HomeComponent } from "./view/visitor/home/home.component";
import { ProfileComponent } from "./view/connected/profile/profile.component";
import { TodayComponent } from "./view/connected/today/today.component";
import { ProjectManagerComponent } from "./view/connected/project-manager/project-manager.component";
import { CreateProjectComponent } from "./view/connected/create-project/create-project.component";
import { MyProjectComponent } from "./view/connected/my-project/my-project.component";
import { NotFoundComponent } from "./view/not-found/not-found.component";
import {MeetingComponent} from "./view/connected/meeting/meeting.component";
import { AuthGuard } from './helpers';
import {ProductBacklogComponent} from "./view/connected/product-backlog/product-backlog.component";
import {JoinProjectComponent} from "./view/connected/join-project/join-project.component";
import {UsersRequestComponent} from "./view/connected/users-request/users-request.component";
import {CreateSprintComponent} from "./view/connected/create-sprint/create-sprint.component";
import {VisitorGuard} from "./helpers/guard/visitor.guard";
import {VideoComponent} from "./view/video-call/video/video.component";
import { ProjectPreviewComponent } from "./view/connected/project-preview/project-preview.component";
import {CreateUserStoryComponent} from "./view/connected/create-user-story/create-user-story.component";
import {ModifyUserStoryComponent} from "./view/connected/modify-user-story/modify-user-story.component";
import {CreateMeetingComponent} from "./view/connected/create-meeting/create-meeting.component";
import {UserListComponent} from "./view/connected/user-list/user-list.component";
import {SprintUserStoryComponent} from "./view/connected/sprint-user-story/sprint-user-story.component";
import {CommentsComponent} from "./view/connected/comments/comments.component";

const routes: Routes = [
    {path: '', component : HomeComponent},
    {path: 'team', component: MeetTheTeamComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component : LoginComponent, canActivate:[VisitorGuard]},
    {path: 'signUp', component : SignUpComponent, canActivate:[VisitorGuard]},
    {path: 'homeVisitor', component : HomeComponent},
    {path: 'profile', component : ProfileComponent, canActivate:[AuthGuard]},
    {path: 'meetings', component : MeetingComponent, canActivate:[AuthGuard]},
    {path: 'today', component : TodayComponent, canActivate:[AuthGuard]},
    {path: 'projectManager', component : ProjectManagerComponent, canActivate:[AuthGuard]},
    {path: 'createProject', component : CreateProjectComponent, canActivate:[AuthGuard]},
    {path: 'myProject/:projectName', component : MyProjectComponent, canActivate:[AuthGuard]},
    {path: 'productBacklog/:projectName/:idProject', component : ProductBacklogComponent, canActivate:[AuthGuard]},
    {path: 'joinProject', component : JoinProjectComponent, canActivate:[AuthGuard]},
    {path: 'usersRequest', component : UsersRequestComponent, canActivate:[AuthGuard]},
    {path: 'createSprint/:projectName', component : CreateSprintComponent, canActivate:[AuthGuard]},
    {path: 'projectPreview/:projectName', component : ProjectPreviewComponent, canActivate:[AuthGuard]},
    {path: 'videocall', component : VideoComponent,canActivate:[AuthGuard]},
    {path: 'createUserStory/:projectName/:idProject', component : CreateUserStoryComponent,canActivate:[AuthGuard]},
    {path: 'modifyUserStory/:projectName/:idProject/:idUserStory', component : ModifyUserStoryComponent,canActivate:[AuthGuard]},
    {path: 'createMeeting/:projectName/:sprintId', component : CreateMeetingComponent,canActivate:[AuthGuard]},
    {path: 'userList/:projectName/:idProject', component : UserListComponent, canActivate:[AuthGuard]},
    {path: 'comments/:idUserStory/:projectName', component : CommentsComponent, canActivate:[AuthGuard]},
    {path: 'sprintUserStory/:sprintName/:idSprint', component : SprintUserStoryComponent, canActivate:[AuthGuard]},
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
