import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  id: any;
  courseDetail: course;

  constructor(activatedRouter: ActivatedRoute, courseService: CourseService) {
    this.id = activatedRouter?.snapshot?.paramMap?.get('id');
    this.courseDetail = courseService.getCourse().filter((x) => x?.Id === +this.id)[0];
  }

  ngOnInit(): void {
  }

}
